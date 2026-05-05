import { motion } from "motion/react";

export default function ArtSection() {
  return (
    <section id="art" className="py-32 px-8 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-md"
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-8">The Philosophy</h3>
          <h2 className="text-5xl md:text-7xl font-serif leading-none mb-12 italic">The Art <br /> Behind <br /> the Pieces</h2>
          
          <p className="text-2xl font-serif italic text-brand-berry mb-8 leading-tight">
            “Before it was worn, it was seen.”
          </p>
          
          <p className="text-brand-accent leading-relaxed mb-12">
            Every piece begins with Tutti Frutti Women artwork: bold, brave and created around visibility, courage, and beauty.
          </p>
          
          <a 
            href="#shop" 
            className="link-underline text-[10px] uppercase tracking-[0.3em] font-bold text-brand-black"
          >
            View Pieces
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="gallery-frame rotate-2 bg-white p-8 md:p-12">
            <div className="aspect-[4/5] bg-brand-cream overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1549474843-ed839829349c?auto=format&fit=crop&q=80&w=1200" 
                alt="Artwork" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="mt-8 text-center">
              <p className="font-serif italic text-sm opacity-50">Untitled Study 04 (Visibility Series)</p>
            </div>
          </div>
          
          {/* Subtle accent blob */}
          <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-brand-blush/30 rounded-full blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
}
