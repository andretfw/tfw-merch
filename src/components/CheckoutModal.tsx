import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, ArrowRight, CheckCircle2, Truck } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCart } from "../context/CartContext";
import PayPalCheckoutButton from "./PayPalCheckoutButton";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = "shipping" | "payment" | "success";

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

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    zip: "",
  });

  const { cartItems, totalPrice, clearCart } = useCart();

  const handleShippingChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");

    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  const handleClose = () => {
    setStep("shipping");
    setTermsAccepted(false);
    onClose();
  };

  const inputClass =
    "bg-transparent w-full focus:outline-none text-sm placeholder:opacity-20 py-1";

  const fieldWrapClass = "border-b border-brand-black/10 py-2";

  const labelClass =
    "text-[9px] uppercase tracking-widest font-bold opacity-30 mb-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-brand-cream w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
          >
            {/* Left: Summary */}
            <div className="hidden md:flex md:w-1/3 bg-white p-12 flex-col justify-between border-r border-brand-black/5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-12">
                  Order Summary
                </h3>

                <div className="space-y-6 overflow-y-auto max-h-[40vh] pr-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-12 h-16 bg-brand-cream shrink-0 grayscale">
                        <img
                          src={item.product.image}
                          className="w-full h-full object-cover"
                          alt={item.product.name}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                          {item.product.name}
                        </p>
                        <p className="text-[9px] opacity-40 uppercase tracking-tighter mt-1">
                          {item.size} • {item.color} • x{item.quantity}
                        </p>
                        <p className="text-[10px] font-medium mt-2">
                          €{item.product.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-brand-black/5">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">
                    Total
                  </span>
                  <span className="text-2xl font-serif">€{totalPrice}</span>
                </div>

                <div className="flex items-center gap-2 opacity-30">
                  <ShieldCheck size={12} />
                  <span className="text-[9px] uppercase tracking-widest font-bold">
                    Secure Checkout
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Flow */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-brand-cream">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <div className="flex gap-3 md:gap-4 items-center">
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[9px] md:text-[10px] font-bold ${
                      step === "shipping"
                        ? "bg-brand-black text-white"
                        : "bg-transparent border-brand-black/20 text-brand-black"
                    }`}
                  >
                    1
                  </div>

                  <div className="w-6 md:w-8 h-[1px] bg-brand-black/10" />

                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[9px] md:text-[10px] font-bold ${
                      step === "payment"
                        ? "bg-brand-black text-white"
                        : "bg-transparent border-brand-black/20 text-brand-black"
                    }`}
                  >
                    2
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <X size={20} strokeWidth={1} />
                </button>
              </div>

              {step === "shipping" && (
                <motion.form
                  onSubmit={handleShippingSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 md:space-y-8"
                >
                  <h2 className="text-3xl md:text-4xl font-serif italic mb-6 md:mb-10">
                    Delivery Details
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`col-span-2 md:col-span-1 ${fieldWrapClass}`}>
                      <p className={labelClass}>First Name *</p>
                      <input
                        name="firstName"
                        type="text"
                        required
                        value={shippingDetails.firstName}
                        onChange={handleShippingChange}
                        className={inputClass}
                        placeholder="Avery"
                      />
                    </div>

                    <div className={`col-span-2 md:col-span-1 ${fieldWrapClass}`}>
                      <p className={labelClass}>Last Name *</p>
                      <input
                        name="lastName"
                        type="text"
                        required
                        value={shippingDetails.lastName}
                        onChange={handleShippingChange}
                        className={inputClass}
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`col-span-2 md:col-span-1 ${fieldWrapClass}`}>
                      <p className={labelClass}>Email Address *</p>
                      <input
                        name="email"
                        type="email"
                        required
                        value={shippingDetails.email}
                        onChange={handleShippingChange}
                        className={inputClass}
                        placeholder="avery@example.com"
                      />
                    </div>

                    <div className={`col-span-2 md:col-span-1 ${fieldWrapClass}`}>
                      <p className={labelClass}>Phone Number *</p>
                      <input
                        name="phone"
                        type="tel"
                        required
                        value={shippingDetails.phone}
                        onChange={handleShippingChange}
                        className={inputClass}
                        placeholder="+40 700 000 000"
                      />
                    </div>
                  </div>

                  <div className={fieldWrapClass}>
                    <p className={labelClass}>Country *</p>
                    <select
                      name="country"
                      required
                      value={shippingDetails.country}
                      onChange={handleShippingChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select country</option>
                      <option value="RO">Romania</option>
                      <option value="ES">Spain</option>
                      <option value="PT">Portugal</option>
                      <option value="IT">Italy</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="GB">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>

                  <div className={fieldWrapClass}>
                    <p className={labelClass}>Street Address *</p>
                    <input
                      name="address1"
                      type="text"
                      required
                      value={shippingDetails.address1}
                      onChange={handleShippingChange}
                      className={inputClass}
                      placeholder="123 Bold Avenue"
                    />
                  </div>

                  <div className={fieldWrapClass}>
                    <p className={labelClass}>Apartment, Suite, Floor</p>
                    <input
                      name="address2"
                      type="text"
                      value={shippingDetails.address2}
                      onChange={handleShippingChange}
                      className={inputClass}
                      placeholder="Apartment 4B"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className={`col-span-3 md:col-span-1 ${fieldWrapClass}`}>
                      <p className={labelClass}>City *</p>
                      <input
                        name="city"
                        type="text"
                        required
                        value={shippingDetails.city}
                        onChange={handleShippingChange}
                        className={inputClass}
                        placeholder="Bucharest"
                      />
                    </div>

                    <div className={`col-span-3 md:col-span-1 ${fieldWrapClass}`}>
                      <p className={labelClass}>State / Region *</p>
                      <input
                        name="region"
                        type="text"
                        required
                        value={shippingDetails.region}
                        onChange={handleShippingChange}
                        className={inputClass}
                        placeholder="Bucharest"
                      />
                    </div>

                    <div className={`col-span-3 md:col-span-1 ${fieldWrapClass}`}>
                      <p className={labelClass}>ZIP / Postal Code *</p>
                      <input
                        name="zip"
                        type="text"
                        required
                        value={shippingDetails.zip}
                        onChange={handleShippingChange}
                        className={inputClass}
                        placeholder="010101"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-brand-black text-white uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 group mt-8 md:mt-12"
                  >
                    Continue to Payment
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </motion.form>
              )}

              {step === "payment" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 md:space-y-8"
                >
                  <h2 className="text-3xl md:text-4xl font-serif italic mb-6 md:mb-10 text-brand-black">
                    Payment
                  </h2>

                  <div className="bg-white/50 p-6 border border-brand-black/5 text-[10px] tracking-wide leading-relaxed italic opacity-60">
                    You will complete your payment securely through PayPal. After
                    payment, we will prepare your order for production.
                  </div>

                  <div className="flex items-start gap-3 px-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(event) => setTermsAccepted(event.target.checked)}
                      className="mt-1 accent-brand-black cursor-pointer"
                    />
                    <label
                      htmlFor="terms"
                      className="text-[9px] uppercase tracking-widest font-bold opacity-40 cursor-pointer select-none"
                    >
                      I agree to the{" "}
                      <a href="#" className="underline">
                        Terms of Service
                      </a>{" "}
                      &{" "}
                      <a href="#" className="underline">
                        Shipping Policy
                      </a>
                    </label>
                  </div>

                  {termsAccepted ? (
                    <PayPalCheckoutButton
                      totalPrice={totalPrice}
                      shippingDetails={shippingDetails}
                      onSuccess={handlePaymentSuccess}
                    />
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-6 bg-brand-black/30 text-white uppercase tracking-[0.2em] font-bold text-[10px] cursor-not-allowed"
                    >
                      Agree to Terms to Continue
                    </button>
                  )}
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-24 h-24 bg-brand-berry/10 rounded-full flex items-center justify-center mb-10 text-brand-berry">
                    <CheckCircle2 size={48} strokeWidth={1} />
                  </div>

                  <h2 className="text-5xl font-serif italic mb-6">
                    Made for the Bold.
                  </h2>

                  <p className="text-brand-accent max-w-sm mb-12 italic">
                    Your order has been received. We are preparing the artwork for
                    its journey to your home.
                  </p>

                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold opacity-30">
                    <Truck size={14} />
                    <span>Reference: TFW-2026-88A</span>
                  </div>

                  <button
                    onClick={handleClose}
                    className="mt-16 px-12 py-5 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold"
                  >
                    Return to Gallery
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
