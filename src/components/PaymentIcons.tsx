import { CreditCard } from "lucide-react";

export default function PaymentIcons() {
  const methods = ["Apple Pay", "Google Pay", "PayPal", "Visa", "Mastercard"];
  
  return (
    <div className="flex flex-wrap gap-2 items-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
      <CreditCard size={12} strokeWidth={1.5} />
      {methods.map((method) => (
        <span key={method} className="text-[8px] uppercase tracking-widest font-bold border border-brand-black/20 px-1.5 py-0.5">
          {method}
        </span>
      ))}
    </div>
  );
}
