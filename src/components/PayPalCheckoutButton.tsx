import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  zip: string;
}

interface PayPalCheckoutButtonProps {
  totalPrice: number;
  shippingDetails: ShippingDetails;
  cartItems: any[];
  onSuccess: () => void;
}

export default function PayPalCheckoutButton({
  totalPrice,
  shippingDetails,
  cartItems,
  onSuccess,
}: PayPalCheckoutButtonProps) {
  const paypalRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId) {
      setErrorMessage("Missing PayPal Client ID.");
      return;
    }

    const renderButtons = () => {
      if (!window.paypal || !paypalRef.current) return;

      paypalRef.current.innerHTML = "";

      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "black",
            shape: "rect",
            label: "paypal",
          },

          createOrder: async () => {
            setErrorMessage("");

            const response = await fetch("/.netlify/functions/paypal-create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: totalPrice,
                currency: "EUR",
                shippingDetails,
              }),
            });

            const data = await response.json();

            if (!response.ok || !data.id) {
              throw new Error(data.error || "Could not create PayPal order.");
            }

            return data.id;
          },

          onApprove: async (data: any) => {
            setErrorMessage("");

            const response = await fetch("/.netlify/functions/paypal-capture-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID,
                cartItems,
                shippingDetails,
              }),
            });

            const captureData = await response.json();

            if (!response.ok) {
              console.error("PayPal / POD order error:", captureData);

              setErrorMessage(
                captureData.error ||
                  "Payment was captured, but the production order could not be created. Please contact us."
              );

              return;
            }

            onSuccess();
          },

          onError: (err: any) => {
            console.error("PayPal error:", err);
            setErrorMessage("PayPal payment failed. Please try again.");
          },
        })
        .render(paypalRef.current);
    };

    const existingScript = document.querySelector("#paypal-sdk");

    if (existingScript) {
      renderButtons();
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture`;
    script.async = true;
    script.onload = renderButtons;
    script.onerror = () => setErrorMessage("Could not load PayPal.");
    document.body.appendChild(script);
  }, [totalPrice, shippingDetails, cartItems, onSuccess]);

  return (
    <div className="space-y-4">
      <div ref={paypalRef} />

      {errorMessage && (
        <p className="text-xs text-red-600 tracking-wide leading-relaxed">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
