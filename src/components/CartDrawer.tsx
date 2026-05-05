import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            id="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col pt-safe"
          >
            <div className="p-6 md:p-8 border-b border-brand-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <h2 className="font-serif italic text-xl md:text-2xl">Shopping Bag</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-brand-cream rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10">
                  <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center opacity-40">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-lg md:text-xl mb-2">Your bag is empty</h3>
                    <p className="text-[10px] text-brand-accent uppercase tracking-widest opacity-60">Seek the Art within the Shop</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold"
                  >
                    Return to Shop
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 md:gap-6">
                    <div className="w-20 md:w-24 h-28 md:h-32 bg-brand-cream overflow-hidden border border-brand-black/5 shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover grayscale-[0.2]"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="text-[11px] md:text-xs font-bold uppercase tracking-widest truncate">{item.product.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[9px] md:text-[10px] text-brand-accent uppercase tracking-[0.1em] mb-4">
                          {item.color} • {item.size}
                        </p>
                        <div className="flex items-center gap-4 text-xs md:text-sm font-medium">
                          <div className="flex border border-brand-black/10">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 md:px-3 py-1 hover:bg-brand-cream"
                            >-</button>
                            <span className="px-2 md:px-3 py-1 border-x border-brand-black/10 text-[9px] md:text-[10px] flex items-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 md:px-3 py-1 hover:bg-brand-cream"
                            >+</button>
                          </div>
                          <span>€{item.product.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 md:p-8 bg-brand-cream border-t border-brand-black/5 space-y-4 md:space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-1">Subtotal</p>
                    <p className="text-[9px] italic opacity-60">Excluding shipping & taxes</p>
                  </div>
                  <p className="text-xl md:text-2xl font-serif">€{totalPrice}</p>
                </div>
                <button 
                  id="checkout-btn"
                  onClick={onCheckout}
                  className="w-full bg-brand-black text-white py-5 md:py-6 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-berry transition-all group"
                >
                  Proceed to Checkout
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
