import { motion } from "motion/react";

const categories = [
  { name: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800" },
  { name: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800" },
  { name: "Sweatshirts", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=800" },
  { name: "Long Sleeves", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800" },
];

export default function CategorySection({ onSelectCategory }: { onSelectCategory: (cat: string) => void }) {
  return (
    <section className="py-32 px-8 md:px-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-serif italic mb-20 text-center">Shop Apparel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
                const shopSection = document.getElementById('shop');
                shopSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[3/4] overflow-hidden group border border-brand-black/5 text-left cursor-pointer"
            >
              <img 
                src={cat.image} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                alt={cat.name} 
              />
              <div className="absolute inset-0 bg-brand-black/40 flex items-center justify-center transition-opacity group-hover:bg-brand-black/10">
                <h3 className="text-white text-3xl font-serif italic tracking-tight">{cat.name}</h3>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
