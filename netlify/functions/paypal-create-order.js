async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const base = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

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

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const base = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";
    const body = JSON.parse(event.body || "{}");

    const { amount, currency = "EUR", shippingDetails } = body;

    if (!amount || Number(amount) <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid amount" }),
      };
    }

    if (
      !shippingDetails?.firstName ||
      !shippingDetails?.lastName ||
      !shippingDetails?.email ||
      !shippingDetails?.address1 ||
      !shippingDetails?.city ||
      !shippingDetails?.zip ||
      !shippingDetails?.country
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing shipping details" }),
      };
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: Number(amount).toFixed(2),
            },
            shipping: {
              name: {
                full_name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
              },
              address: {
                address_line_1: shippingDetails.address1,
                address_line_2: shippingDetails.address2 || "",
                admin_area_2: shippingDetails.city,
                admin_area_1: shippingDetails.region || shippingDetails.city,
                postal_code: shippingDetails.zip,
                country_code: shippingDetails.country,
              },
            },
          },
        ],
        payer: {
          name: {
            given_name: shippingDetails.firstName,
            surname: shippingDetails.lastName,
          },
          email_address: shippingDetails.email,
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(order),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: order.id,
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
