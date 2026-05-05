import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, ShieldCheck, ArrowRight, CheckCircle2, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'shipping' | 'payment' | 'success';

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'wallet'>('card');
  const { cartItems, totalPrice, clearCart } = useCart();

  const handleOrder = () => {
    // Later this will call /.netlify/functions/create-checkout
    setStep('success');
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  const handleClose = () => {
    setStep('shipping');
    onClose();
  };

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
            {/* Left: Summary (Desktop) */}
            <div className="hidden md:flex md:w-1/3 bg-white p-12 flex-col justify-between border-r border-brand-black/5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-30 mb-12">Order Summary</h3>
                <div className="space-y-6 overflow-y-auto max-h-[40vh] pr-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-12 h-16 bg-brand-cream shrink-0 grayscale">
                        <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">{item.product.name}</p>
                        <p className="text-[9px] opacity-40 uppercase tracking-tighter mt-1">{item.size} • {item.color} • x{item.quantity}</p>
                        <p className="text-[10px] font-medium mt-2">€{item.product.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-brand-black/5">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Total</span>
                  <span className="text-2xl font-serif">€{totalPrice}</span>
                </div>
                <div className="flex items-center gap-2 opacity-30">
                  <ShieldCheck size={12} />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Secure Checkout</span>
                </div>
              </div>
            </div>

            {/* Right: Flow */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-brand-cream">
              <div className="flex justify-between items-center mb-8 md:mb-12">
                <div className="flex gap-3 md:gap-4 items-center">
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[9px] md:text-[10px] font-bold ${step === 'shipping' ? 'bg-brand-black text-white' : 'bg-transparent border-brand-black/20 text-brand-black'}`}>1</div>
                  <div className="w-6 md:w-8 h-[1px] bg-brand-black/10" />
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[9px] md:text-[10px] font-bold ${step === 'payment' ? 'bg-brand-black text-white' : 'bg-transparent border-brand-black/20 text-brand-black'}`}>2</div>
                </div>
                <button onClick={handleClose} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                  <X size={20} strokeWidth={1} />
                </button>
              </div>

              {step === 'shipping' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-8">
                  <h2 className="text-3xl md:text-4xl font-serif italic mb-6 md:mb-10">Delivery Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1 border-b border-brand-black/10 py-2">
                    <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-1">First Name</p>
                    <input type="text" className="bg-transparent w-full focus:outline-none text-sm placeholder:opacity-20 py-1" placeholder="Avery" />
                    </div>
                    <div className="col-span-2 md:col-span-1 border-b border-brand-black/10 py-2">
                    <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-1">Last Name</p>
                    <input type="text" className="bg-transparent w-full focus:outline-none text-sm placeholder:opacity-20 py-1" placeholder="Smith" />
                    </div>
                  </div>
                  <div className="border-b border-brand-black/10 py-2">
                    <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-1">Email Address</p>
                    <input type="email" className="bg-transparent w-full focus:outline-none text-sm placeholder:opacity-20 py-1" placeholder="avery@example.com" />
                  </div>
                  <div className="border-b border-brand-black/10 py-2">
                    <p className="text-[9px] uppercase tracking-widest font-bold opacity-30 mb-1">Street Address</p>
                    <input type="text" className="bg-transparent w-full focus:outline-none text-sm placeholder:opacity-20 py-1" placeholder="123 Bold Avenue" />
                  </div>
                  <button 
                    onClick={() => setStep('payment')}
                    className="w-full py-5 bg-brand-black text-white uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 group mt-8 md:mt-12"
                  >
                    Continue to Payment
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 md:space-y-8">
                  <h2 className="text-3xl md:text-4xl font-serif italic mb-6 md:mb-10 text-brand-black">Payment</h2>
                  
                  <div className="space-y-3 md:space-y-4">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full flex items-center justify-between p-4 md:p-6 border transition-all ${paymentMethod === 'card' ? 'border-brand-black bg-white shadow-lg' : 'border-brand-black/10 opacity-60'}`}
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard size={18} strokeWidth={1} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Credit / Debit Card</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'card' ? 'bg-brand-black border-brand-black' : 'border-brand-black/20'}`} />
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('paypal')}
                      className={`w-full flex items-center justify-between p-4 md:p-6 border transition-all ${paymentMethod === 'paypal' ? 'border-brand-black bg-white shadow-lg' : 'border-brand-black/10 opacity-60'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase tracking-widest font-bold font-sans">PayPal</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'paypal' ? 'bg-brand-black border-brand-black' : 'border-brand-black/20'}`} />
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('wallet')}
                      className={`w-full flex items-center justify-between p-4 md:p-6 border transition-all ${paymentMethod === 'wallet' ? 'border-brand-black bg-white shadow-lg' : 'border-brand-black/10 opacity-60'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase tracking-widest font-bold">Digital Wallet</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'wallet' ? 'bg-brand-black border-brand-black' : 'border-brand-black/20'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-3 opacity-30 mt-4">
                    <span className="text-[8px] uppercase tracking-widest font-bold">Secure payments processed by</span>
                    <svg viewBox="0 0 60 25" className="h-4 fill-current">
                      <path d="M59.64 14.28c0-4.59-2.45-6.19-5.71-6.19-3.41 0-5.88 2.01-5.88 5.4 0 5.49 7.42 4.6 7.42 6.95 0 .97-.88 1.4-1.89 1.4-1.28 0-2.31-.55-2.31-1.57h-3.66c0 2.92 2.38 4.73 5.97 4.73 3.6 0 5.76-1.82 5.76-5.02 0-5.74-7.42-4.53-7.42-7.01 0-.84.77-1.35 1.77-1.35 1.13 0 2.07.41 2.07 1.46h3.88zm-14.7 6.4v-8.12h-3.83v1.54c-.66-1.12-2.1-1.78-3.49-1.78-2.85 0-5.26 2.37-5.26 5.64 0 3.32 2.41 5.7 5.26 5.7 1.4 0 2.83-.67 3.49-1.79v1.51h3.83zm-3.83-3.32c0 1.95-1.52 3.37-3.35 3.37-1.83 0-3.35-1.39-3.35-3.37s1.52-3.37 3.35-3.37c1.83 0 3.35 1.39 3.35 3.37zm-8.83-9.17h-3.83v11.75h3.83V8.19zm-1.92-5.18c-1.28 0-2.32 1.04-2.32 2.31 0 1.28 1.04 2.32 2.32 2.32 1.28 0 2.32-1.04 2.32-2.32a2.33 2.33 0 0 0-2.32-2.31zm-6.13 5.43v-2.19h-3.61v2.19h-1.9v2.54h1.9v5.99c0 2.87 2.11 4.31 4.74 4.31 1.05 0 1.83-.16 2.44-.39v-2.82c-.22.08-.66.19-1.19.19-1.07 0-1.63-.58-1.63-1.64v-5.64h2.82v-2.54h-2.82v.01zm-10.05 0c-.66-1.12-2.1-1.78-3.49-1.78-2.85 0-5.26 2.37-5.26 5.64 0 3.32 2.41 5.7 5.26 5.7 1.4 0 2.83-.67 3.49-1.79v1.51h3.83V8.19h-3.83v1.54zm-3.83 1.93c1.83 0 3.35 1.42 3.35 3.37 0 1.95-1.52 3.37-3.35 3.37-1.83 0-3.35-1.39-3.35-3.37s1.52-3.37 3.35-3.37z" />
                    </svg>
                  </div>

                  <div className="bg-white/50 p-6 border border-brand-black/5 text-[10px] tracking-wide leading-relaxed italic opacity-60">
                    Your artwork will be printed specially for you upon confirmation. Orders are secured via industry-standard encryption.
                  </div>

                  <div className="flex items-start gap-3 px-1">
                    <input type="checkbox" id="terms" className="mt-1 accent-brand-black cursor-pointer" required />
                    <label htmlFor="terms" className="text-[9px] uppercase tracking-widest font-bold opacity-40 cursor-pointer select-none">
                      I agree to the <a href="#" className="underline">Terms of Service</a> & <a href="#" className="underline">Shipping Policy</a>
                    </label>
                  </div>

                  <button 
                    onClick={handleOrder}
                    className="w-full py-6 bg-brand-berry text-white uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-brand-black"
                  >
                    Place Your Order • €{totalPrice}
                  </button>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-24 h-24 bg-brand-berry/10 rounded-full flex items-center justify-center mb-10 text-brand-berry">
                    <CheckCircle2 size={48} strokeWidth={1} />
                  </div>
                  <h2 className="text-5xl font-serif italic mb-6">Made for the Bold.</h2>
                  <p className="text-brand-accent max-w-sm mb-12 italic">Your order has been received. We are preparing the artwork for its journey to your home.</p>
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold opacity-30">
                    <Truck size={14} />
                    <span>Reference: TFW-2024-88A</span>
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
