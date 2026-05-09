import { Handler } from "@netlify/functions";

type ShippingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  address1: string;
  address2?: string;
  city: string;
  region?: string;
  zip: string;
};

type CartItem = {
  quantity: number;
  size?: string;
  color?: string;
  product: {
    id: string;
    name: string;
    provider?: "printify" | "printful";
    originalProductId?: string;
    printifyProductId?: string;
    printifyVariantId?: number | string;
    printfulVariantId?: number | string;
  };
};

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function getFullName(shipping: ShippingDetails) {
  return `${shipping.firstName} ${shipping.lastName}`.trim();
}

function normalizePrintifyProductId(product: CartItem["product"]) {
  const rawId =
    product.originalProductId ||
    product.printifyProductId ||
    product.id.replace(/^printify-/, "").split("-")[0];

  return rawId.replace(/^printify-/, "");
}

async function createPrintifyOrder(
  items: CartItem[],
  shipping: ShippingDetails,
  paypalOrderId: string
) {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token || !shopId) {
    throw new Error("Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID.");
  }

  const lineItems = items.map((item) => {
    const productId = normalizePrintifyProductId(item.product);
    const variantId = item.product.printifyVariantId;

    if (!productId || !variantId) {
      throw new Error(`Missing Printify product or variant ID for ${item.product.name}.`);
    }

    return {
      product_id: productId,
      variant_id: Number(variantId),
      quantity: item.quantity || 1,
    };
  });

  const response = await fetch(
    `https://api.printify.com/v1/shops/${shopId}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=utf-8",
        "User-Agent": "TFW Wearable Art Website",
      },
      body: JSON.stringify({
        external_id: `paypal-${paypalOrderId}-printify`,
        label: `TFW PayPal Order ${paypalOrderId}`,
        line_items: lineItems,
        shipping_method: 1,
        send_shipping_notification: true,
        address_to: {
          first_name: shipping.firstName,
          last_name: shipping.lastName,
          email: shipping.email,
          phone: shipping.phone || "",
          country: shipping.country,
          region: shipping.region || shipping.city,
          address1: shipping.address1,
          address2: shipping.address2 || "",
          city: shipping.city,
          zip: shipping.zip,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Printify order failed: ${JSON.stringify(data)}`);
  }

  return data;
}

async function createPrintfulOrder(
  items: CartItem[],
  shipping: ShippingDetails,
  paypalOrderId: string
) {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("Missing PRINTFUL_API_TOKEN.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "TFW Wearable Art Website",
  };

  if (process.env.PRINTFUL_STORE_ID) {
    headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  }

  const printfulItems = items.map((item) => {
    const syncVariantId = item.product.printfulVariantId;

    if (!syncVariantId) {
      throw new Error(`Missing Printful sync variant ID for ${item.product.name}.`);
    }

    return {
      sync_variant_id: Number(syncVariantId),
      quantity: item.quantity || 1,
    };
  });

  const confirmOrder = process.env.POD_CONFIRM_ORDERS === "true";

  const response = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers,
    body: JSON.stringify({
      external_id: `paypal-${paypalOrderId}-printful`,
      confirm: confirmOrder,
      recipient: {
        name: getFullName(shipping),
        address1: shipping.address1,
        address2: shipping.address2 || "",
        city: shipping.city,
        state_code: shipping.region || "",
        country_code: shipping.country,
        zip: shipping.zip,
        phone: shipping.phone || "",
        email: shipping.email,
      },
      items: printfulItems,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Printful order failed: ${JSON.stringify(data)}`);
  }

  return data;
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method not allowed." });
    }

    const body = JSON.parse(event.body || "{}");

    const {
      paypalOrderId,
      shippingDetails,
      cartItems,
    }: {
      paypalOrderId: string;
      shippingDetails: ShippingDetails;
      cartItems: CartItem[];
    } = body;

    if (!paypalOrderId) {
      return json(400, { error: "Missing PayPal order ID." });
    }

    if (!shippingDetails?.email || !shippingDetails?.address1 || !shippingDetails?.country) {
      return json(400, { error: "Missing shipping details." });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return json(400, { error: "Cart is empty." });
    }

    const printifyItems = cartItems.filter(
      (item) =>
        item.product.provider === "printify" ||
        item.product.printifyVariantId
    );

    const printfulItems = cartItems.filter(
      (item) =>
        item.product.provider === "printful" ||
        item.product.printfulVariantId
    );

    const results: Record<string, unknown> = {};

    if (printifyItems.length > 0) {
      results.printify = await createPrintifyOrder(
        printifyItems,
        shippingDetails,
        paypalOrderId
      );
    }

    if (printfulItems.length > 0) {
      results.printful = await createPrintfulOrder(
        printfulItems,
        shippingDetails,
        paypalOrderId
      );
    }

    return json(200, {
      success: true,
      message: "POD order created.",
      results,
    });
  } catch (error) {
    return json(500, {
      success: false,
      error: error instanceof Error ? error.message : "Unknown server error.",
    });
  }
};
