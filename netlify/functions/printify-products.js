export async function handler() {
  try {
    const token = process.env.PRINTIFY_API_TOKEN;
    const shopId = process.env.PRINTIFY_SHOP_ID;

    if (!token || !shopId) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID in Netlify.",
        }),
      };
    }

    const response = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json;charset=utf-8",
          "User-Agent": "TFW Merch Website",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Printify API error",
          details: data,
        }),
      };
    }

    const products = (data.data || []).map((product) => {
      const enabledVariants = (product.variants || []).filter(
        (variant) => variant.is_enabled
      );

      const firstVariant = enabledVariants[0] || product.variants?.[0];

      const firstImage =
        product.images?.[0]?.src ||
        product.images?.[0]?.src_url ||
        "";

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        image: firstImage,
        price: firstVariant ? firstVariant.price / 100 : 0,
        variants: enabledVariants.map((variant) => ({
          id: variant.id,
          title: variant.title,
          price: variant.price / 100,
          is_enabled: variant.is_enabled,
        })),
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({
        products,
      }),
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
