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

  return (
    variantName
      .replace(productName, "")
      .replace(/^[-–—|/ ]+/, "")
      .trim() || variantName
  );
}

function cleanBrandDescription(description) {
  const cleaned = (description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "A limited TFW wearable art piece, designed to be seen.";
  }

  const lower = cleaned.toLowerCase();

  if (
    lower.includes("printful") ||
    lower.includes("printify") ||
    lower.includes("fulfilled")
  ) {
    return "A limited TFW wearable art piece, designed to be seen.";
  }

  return cleaned;
}

function uniqueImages(images) {
  const seen = new Set();

  return images
    .filter(Boolean)
    .filter((image) => image.src)
    .filter((image) => {
      if (seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    });
}

function sortImages(images) {
  return [...images].sort((a, b) => {
    if (a.is_default && !b.is_default) return -1;
    if (!a.is_default && b.is_default) return 1;
    if (a.position === "front" && b.position !== "front") return -1;
    if (a.position !== "front" && b.position === "front") return 1;
    return 0;
  });
}

async function getPrintifyProducts() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token || !shopId) return [];

  const listResponse = await fetch(
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

  const listData = await listResponse.json();

  if (!listResponse.ok) {
    throw new Error(listData?.message || "Printify API error");
  }

  const rawProducts = listData.data || [];

  const productDetails = await Promise.all(
    rawProducts.map(async (listProduct) => {
      try {
        const detailResponse = await fetch(
          `https://api.printify.com/v1/shops/${shopId}/products/${listProduct.id}.json`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json;charset=utf-8",
              "User-Agent": "TFW Wearable Art Website",
            },
          }
        );

        const detailData = await detailResponse.json();

        const product = detailResponse.ok ? detailData : listProduct;

        const enabledVariants = (product.variants || []).filter(
          (variant) => variant.is_enabled
        );

        const firstVariant = enabledVariants[0] || product.variants?.[0];

        const allImages = sortImages(
          uniqueImages(
            (product.images || []).map((image) => ({
              src: image.src || image.src_url || image.preview_url || "",
              variant_ids: image.variant_ids || [],
              position: image.position || "",
              is_default: image.is_default || false,
            }))
          )
        );

        function getImagesForVariant(variantId) {
          const numericVariantId = Number(variantId);

          const matchingImages = allImages.filter((image) =>
            (image.variant_ids || []).map(Number).includes(numericVariantId)
          );

          return matchingImages.length > 0 ? matchingImages : allImages;
        }

        function getMainImageForVariant(variantId) {
          const variantImages = getImagesForVariant(variantId);

          const frontImage = variantImages.find(
            (image) => image.position === "front"
          );

          const defaultImage = variantImages.find((image) => image.is_default);

          return (
            frontImage?.src ||
            defaultImage?.src ||
            variantImages[0]?.src ||
            allImages[0]?.src ||
            ""
          );
        }

        return {
          id: `printify-${product.id}`,
          provider: "printify",
          originalProductId: product.id,
          title: product.title,
          description: cleanBrandDescription(product.description),
          image: firstVariant
            ? getMainImageForVariant(firstVariant.id)
            : allImages[0]?.src || "",
          images: allImages,
          price: firstVariant ? firstVariant.price / 100 : 0,
          variants: enabledVariants.map((variant) => {
            const variantImages = getImagesForVariant(variant.id);

            return {
              id: variant.id,
              title: variant.title,
              price: variant.price / 100,
              is_enabled: variant.is_enabled,
              provider: "printify",
              printifyVariantId: variant.id,
              image: getMainImageForVariant(variant.id),
              images: variantImages,
            };
          }),
        };
      } catch {
        return null;
      }
    })
  );

  return productDetails.filter(Boolean);
}

function getPrintfulVariantImages(variant, fallbackImage) {
  const fileImages = (variant.files || [])
    .flatMap((file) => [
      file.preview_url,
      file.thumbnail_url,
      file.url,
    ])
    .filter(Boolean)
    .map((src, index) => ({
      src,
      variant_ids: [],
      position: index === 0 ? "front" : "",
      is_default: index === 0,
    }));

  if (fileImages.length > 0) return uniqueImages(fileImages);

  if (fallbackImage) {
    return [
      {
        src: fallbackImage,
        variant_ids: [],
        position: "front",
        is_default: true,
      },
    ];
  }

  return [];
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

      const fallbackImage =
        syncProduct?.thumbnail_url ||
        product.thumbnail_url ||
        firstVariant?.files?.[0]?.preview_url ||
        firstVariant?.files?.[0]?.thumbnail_url ||
        "";

      const price = Number(firstVariant?.retail_price || 0);

      const variantData = syncVariants
        .filter((variant) => variant.synced !== false)
        .map((variant) => {
          const variantImages = getPrintfulVariantImages(variant, fallbackImage);

          return {
            id: variant.id,
            title: cleanPrintfulVariantTitle(
              syncProduct?.name || product.name,
              variant.name
            ),
            price: Number(variant.retail_price || price || 0),
            is_enabled: variant.synced !== false,
            provider: "printful",
            printfulVariantId: variant.id,
            image: variantImages[0]?.src || fallbackImage,
            images: variantImages,
          };
        });

      const allImages = uniqueImages([
        {
          src: fallbackImage,
          variant_ids: [],
          position: "front",
          is_default: true,
        },
        ...variantData.flatMap((variant) => variant.images || []),
      ]);

      return {
        id: `printful-${product.id}`,
        provider: "printful",
        originalProductId: product.id,
        title: syncProduct?.name || product.name,
        description: cleanBrandDescription(syncProduct?.description),
        image: allImages[0]?.src || fallbackImage,
        images: allImages,
        price,
        variants: variantData,
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
