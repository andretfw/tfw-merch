import ProductCard from "./ProductCard";
import { products } from "../data/products";
import { motion } from "motion/react";

export default function FeaturedProducts({ filterCategory, onClearFilter, onOpenCheckout }: { filterCategory: string | null, onClearFilter: () => void, onOpenCheckout: () => void }) {
  const filtered = products.filter(p => {
    const isFeatured = p.featured;
    if (!filterCategory) return isFeatured;
    // Simple match: cat name in product category (ignoring 's' for hoodies vs hoodie)
    const cat = filterCategory.toLowerCase().replace(/s$/, '');
    return p.category.toLowerCase().includes(cat);
  });

  return (
    <section id="shop" className="py-32 px-8 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif italic mb-6">
              {filterCategory ? `The ${filterCategory} Selection` : "Featured Pieces"}
            </h2>
            <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-30">
              {filterCategory ? `Archived artwork specifically curated for the ${filterCategory.toLowerCase()} series.` : "Bold artwork. Clean silhouettes. Made to be worn."}
            </p>
          </motion.div>
          {filterCategory && (
            <button 
              onClick={onClearFilter}
              className="text-[10px] uppercase tracking-widest font-bold border-b border-brand-black pb-1 hover:opacity-50 transition-opacity"
            >
              Back to Featured
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} onOpenCheckout={onOpenCheckout} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="font-serif italic text-2xl opacity-40">The collection is currently in the archives.</p>
              <button onClick={onClearFilter} className="mt-8 text-[10px] uppercase tracking-widest font-bold border-brand-black border px-6 py-3">Show All Featured</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
