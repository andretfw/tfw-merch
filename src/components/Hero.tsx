import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center px-8 md:px-12 pt-20">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-[120px] font-serif leading-[0.85] tracking-tighter text-brand-black mb-12"
          >
            Made for the <br />
            <span className="italic relative">
              bold,
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute -bottom-2 left-0 h-[2px] bg-brand-berry opacity-30" 
              />
            </span> the <br />
            brave & the <br />
            <span className="italic">beautiful.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <a 
              href="#shop" 
              className="px-12 py-5 bg-brand-black text-white rounded-none font-medium tracking-widest text-[10px] uppercase hover:bg-brand-berry transition-colors text-center"
            >
              Shop the Collection
            </a>
            <a 
              href="#story" 
              className="px-12 py-5 border border-brand-black/20 text-brand-black rounded-none font-medium tracking-widest text-[10px] uppercase hover:border-brand-black transition-colors text-center"
            >
              The Story
            </a>
          </motion.div>
        </div>
        
        <div className="lg:col-span-6 relative h-[600px] lg:h-[800px] hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="gallery-frame w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" 
              alt="TFW Campaign" 
              className="w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-2 rounded-full">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">Editorial 01</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute -bottom-10 -left-10 gallery-frame w-64 h-80 z-20"
          >
            <img 
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600" 
              alt="Detail" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block">
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-[1px] h-12 bg-brand-black/20"
        />
      </div>
    </section>
  );
}
