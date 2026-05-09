async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal client ID or secret");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Could not get PayPal access token");
  }

  return data.access_token;
}

function getSiteUrl(event) {
  const host = event.headers.host;
  const protocol = event.headers["x-forwarded-proto"] || "https";

  return `${protocol}://${host}`;
}

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const base = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
    const body = JSON.parse(event.body || "{}");

    const { orderID, cartItems, shippingDetails } = body;

    if (!orderID) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing PayPal order ID" }),
      };
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(captureData),
      };
    }

    const captureStatus = captureData?.status;

    if (captureStatus !== "COMPLETED") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "PayPal payment was not completed.",
          paypal: captureData,
        }),
      };
    }

    let podOrder = null;

    if (Array.isArray(cartItems) && cartItems.length > 0 && shippingDetails) {
      const siteUrl = getSiteUrl(event);

      const podResponse = await fetch(
        `${siteUrl}/.netlify/functions/create-printify-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalOrderId: orderID,
            shippingDetails,
            cartItems,
          }),
        }
      );

      podOrder = await podResponse.json();

      if (!podResponse.ok) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            error:
              "Payment was captured, but the production order could not be created.",
            paypal: captureData,
            podOrder,
          }),
        };
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        paypal: captureData,
        podOrder,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
}
