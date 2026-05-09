function getPrintfulHeaders() {
  const headers = {
    Authorization: `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "TFW Wearable Art Website",
  };

  if (process.env.PRINTFUL_STORE_ID) {
    headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  }

  return headers;
}

function cleanVariantTitle(productName, variantName) {
  if (!variantName) return "Default";

  return variantName
    .replace(productName, "")
    .replace(/^[-–—|/ ]+/, "")
    .trim() || variantName;
}

export async function handler() {
  try {
    const token = process.env.PRINTFUL_API_TOKEN;

    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing PRINTFUL_API_TOKEN in Netlify.",
        }),
      };
    }

    const listResponse = await fetch("https://api.printful.com/store/products", {
      method: "GET",
      headers: getPrintfulHeaders(),
    });

    const listData = await listResponse.json();

    if (!listResponse.ok) {
      return {
        statusCode: listResponse.status,
        body: JSON.stringify({
          error: "Printful API error",
          details: listData,
        }),
      };
    }

    const rawProducts = listData.result || [];

    const productDetails = await Promise.all(
      rawProducts.map(async (product) => {
        const detailResponse = await fetch(
          `https://api.printful.com/store/products/${product.id}`,
          {
            method: "GET",
            headers: getPrintfulHeaders(),
          }
        );

        const detailData = await detailResponse.json();

        if (!detailResponse.ok) {
          return null;
        }

        const syncProduct = detailData.result?.sync_product;
        const syncVariants = detailData.result?.sync_variants || [];

        const firstVariant = syncVariants[0];

        const image =
          syncProduct?.thumbnail_url ||
          product.thumbnail_url ||
          firstVariant?.files?.[0]?.preview_url ||
          firstVariant?.files?.[0]?.thumbnail_url ||
          "";

        const price = Number(firstVariant?.retail_price || 0);

        return {
          id: `printful-${product.id}`,
          provider: "printful",
          title: syncProduct?.name || product.name,
          description: "Limited wearable art piece fulfilled through Printful.",
          image,
          price,
          variants: syncVariants
            .filter((variant) => variant.synced !== false)
            .map((variant) => ({
              id: variant.id,
              title: cleanVariantTitle(syncProduct?.name || product.name, variant.name),
              price: Number(variant.retail_price || price || 0),
              is_enabled: variant.synced !== false,
              provider: "printful",
              printfulVariantId: variant.id,
            })),
        };
      })
    );

    const products = productDetails.filter(Boolean);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: error.message,
      }),
    };
  }
}
