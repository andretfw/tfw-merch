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

function cleanPrintfulVariantTitle(productName, variantName) {
  if (!variantName) return "Default";

  return variantName
    .replace(productName, "")
    .replace(/^[-–—|/ ]+/, "")
    .trim() || variantName;
}

async function getPrintifyProducts() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token || !shopId) return [];

  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/products.json`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=utf-8",
        "User-Agent": "TFW Wearable Art Website",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Printify API error");
  }

  return (data.data || []).map((product) => {
    const enabledVariants = (product.variants || []).filter(
      (variant) => variant.is_enabled
    );

    const firstVariant = enabledVariants[0] || product.variants?.[0];

    return {
      id: `printify-${product.id}`,
      provider: "printify",
      originalProductId: product.id,
      title: product.title,
      description: product.description || "",
      image: `/.netlify/functions/printify-image?productId=${product.id}&index=0`,
      price: firstVariant ? firstVariant.price / 100 : 0,
      variants: enabledVariants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price / 100,
        is_enabled: variant.is_enabled,
        provider: "printify",
        printifyVariantId: variant.id,
      })),
    };
  });
}

async function getPrintfulProducts() {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) return [];

  const listResponse = await fetch("https://api.printful.com/store/products", {
    method: "GET",
    headers: getPrintfulHeaders(),
  });

  const listData = await listResponse.json();

  if (!listResponse.ok) {
    throw new Error(listData?.error?.message || "Printful API error");
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
        originalProductId: product.id,
        title: syncProduct?.name || product.name,
        description: "Limited wearable art piece fulfilled through Printful.",
        image,
        price,
        variants: syncVariants
          .filter((variant) => variant.synced !== false)
          .map((variant) => ({
            id: variant.id,
            title: cleanPrintfulVariantTitle(syncProduct?.name || product.name, variant.name),
            price: Number(variant.retail_price || price || 0),
            is_enabled: variant.synced !== false,
            provider: "printful",
            printfulVariantId: variant.id,
          })),
      };
    })
  );

  return productDetails.filter(Boolean);
}

export async function handler() {
  try {
    const [printifyProducts, printfulProducts] = await Promise.all([
      getPrintifyProducts(),
      getPrintfulProducts(),
    ]);

    const products = [...printifyProducts, ...printfulProducts];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "POD product feed error",
        details: error.message,
      }),
    };
  }
}
