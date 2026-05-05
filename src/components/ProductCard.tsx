import { motion, AnimatePresence } from "motion/react";
import { Product } from "../data/products";
import { useState } from "react";
import { ShoppingBag, ChevronRight, Ruler } from "lucide-react";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor, quantity);
    setTimeout(() => setIsAdding(false), 1000);
  };

  async function createCheckout() {
    console.log("Preparing premium checkout for:", product.name);
    alert(`Initiating secure checkout for ${product.name}... (Placeholder)`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="gallery-frame aspect-[3/4] overflow-hidden mb-6 group-hover:shadow-2xl transition-all duration-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.3] group-hover:grayscale-0"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-serif italic mb-1 group-hover:text-brand-berry transition-colors uppercase tracking-tight">{product.name}</h3>
            <p className="text-[10px] text-brand-accent uppercase tracking-[0.2em]">{product.category}</p>
          </div>
          <span className="text-sm font-medium tracking-tighter">€{product.price}</span>
        </div>

        <p className="text-xs text-brand-accent leading-relaxed opacity-70">
          {product.description}
        </p>

        <div className="pt-4 space-y-6">
          {/* Color Selector */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 mb-3">Colours</p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 text-[9px] uppercase tracking-widest font-medium border transition-all ${
                    selectedColor === color
                      ? "bg-brand-black text-white border-brand-black"
                      : "bg-transparent text-brand-black border-brand-black/10 hover:border-brand-black/40"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30">Sizes</p>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <Ruler size={10} />
                  Guide
                </button>
              </div>
              <select 
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-white border border-brand-black/10 rounded-none px-4 py-3 text-[10px] uppercase tracking-widest focus:outline-none focus:border-brand-black transition-colors"
              >
                <option value="">Select Size</option>
                {product.sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 mb-3">Quantity</p>
              <div className="flex border border-brand-black/10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-1/3 py-3 text-xs">-</button>
                <div className="w-1/3 py-3 text-[10px] flex items-center justify-center font-bold">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="w-1/3 py-3 text-xs">+</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-5 rounded-none font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                isAdding ? 'bg-brand-berry text-white' : 'bg-brand-black text-white hover:bg-brand-berry'
              }`}
            >
              {isAdding ? (
                <>Added to Bag</>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  Add to Shopping Bag
                </>
              )}
            </button>
            <button
              onClick={createCheckout}
              className="w-full py-5 text-brand-black font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:opacity-50 transition-all group/btn"
            >
              Order Now
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-cream p-10 max-w-lg w-full relative shadow-2xl border border-brand-black/5"
            >
              <h3 className="text-2xl font-serif italic mb-8">Precision Fit Guide</h3>
              <table className="w-full text-[10px] uppercase tracking-widest font-bold">
                <thead>
                  <tr className="border-b border-brand-black/10">
                    <td className="py-4 opacity-30">Size</td>
                    <td className="py-4 opacity-30">Chest (CM)</td>
                    <td className="py-4 opacity-30">Length (CM)</td>
                  </tr>
                </thead>
                <tbody className="opacity-60">
                  <tr className="border-b border-brand-black/5">
                    <td className="py-4">S</td>
                    <td className="py-4">98</td>
                    <td className="py-4">68</td>
                  </tr>
                  <tr className="border-b border-brand-black/5">
                    <td className="py-4">M</td>
                    <td className="py-4">104</td>
                    <td className="py-4">70</td>
                  </tr>
                  <tr className="border-b border-brand-black/5">
                    <td className="py-4">L</td>
                    <td className="py-4">110</td>
                    <td className="py-4">72</td>
                  </tr>
                  <tr>
                    <td className="py-4">XL</td>
                    <td className="py-4">116</td>
                    <td className="py-4">74</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-8 text-[9px] italic opacity-40 leading-relaxed">
                * All pieces are measured flat. For a relaxed fit, size up. Printed on premium 100% organic cotton.
              </p>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="mt-10 w-full py-4 border border-brand-black bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest"
              >
                Close Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
