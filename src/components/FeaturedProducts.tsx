import ProductCard from "./ProductCard";
import { products } from "../data/products";
import { motion } from "motion/react";

export default function FeaturedProducts({ onAddToCart }: { onAddToCart: () => void }) {
  const featured = products.filter(p => p.featured);

  return (
    <section id="shop" className="py-32 px-8 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif italic mb-6">Featured Pieces</h2>
            <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-30">
              Bold artwork. Clean silhouettes. Made to be worn.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
          {featured.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
