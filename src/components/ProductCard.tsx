import { motion } from "motion/react";
import { Product } from "../data/products";
import { useState } from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  async function createCheckout() {
    console.log("Preparing premium checkout for:", product.name);
    // Later this will call /.netlify/functions/create-checkout
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
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 mb-3">Sizes</p>
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
              onClick={onAddToCart}
              className="w-full bg-brand-black text-white py-5 rounded-none font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-brand-berry transition-all active:scale-[0.98]"
            >
              <ShoppingBag size={14} />
              Add to Shopping Bag
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
    </motion.div>
  );
}
