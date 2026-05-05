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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-brand-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <h2 className="font-serif italic text-2xl">Shopping Bag</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-brand-cream rounded-full transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center opacity-40">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-xl mb-2">Your bag is empty</h3>
                    <p className="text-xs text-brand-accent uppercase tracking-widest opacity-60">Seek the Art within the Shop</p>
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
                  <div key={item.id} className="flex gap-6">
                    <div className="w-24 h-32 bg-brand-cream overflow-hidden border border-brand-black/5">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover grayscale-[0.2]"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-xs font-bold uppercase tracking-widest">{item.product.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[10px] text-brand-accent uppercase tracking-[0.1em] mb-3">
                          {item.color} • {item.size}
                        </p>
                        <div className="flex items-center gap-4 text-sm font-medium">
                          <div className="flex border border-brand-black/10">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-brand-cream"
                            >-</button>
                            <span className="px-3 py-1 border-x border-brand-black/10 text-[10px]">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-brand-cream"
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
              <div className="p-8 bg-brand-cream border-t border-brand-black/5 space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-1">Subtotal</p>
                    <p className="text-[9px] italic opacity-60">Excluding shipping & taxes</p>
                  </div>
                  <p className="text-2xl font-serif">€{totalPrice}</p>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-brand-black text-white py-6 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-berry transition-all group"
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
