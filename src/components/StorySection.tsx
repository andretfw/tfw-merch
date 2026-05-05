import { motion } from "motion/react";

export default function StorySection() {
  return (
    <section id="story" className="py-40 px-8 md:px-12 bg-white relative overflow-hidden">
      {/* Decorative blurred element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-lavender/20 rounded-full blur-[150px] -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-8xl font-serif italic mb-16 tracking-tight">Bold. Brave. Beautiful.</h2>
          
          <div className="space-y-10 max-w-3xl mx-auto">
            <p className="text-2xl md:text-4xl font-serif italic text-brand-black leading-tight">
              “Tutti Frutti Women was created for women who were judged, underestimated, or made to feel invisible — and still chose color, courage and beauty.”
            </p>
            
            <div className="w-16 h-[1px] bg-brand-berry/30 mx-auto" />
            
            <p className="text-brand-accent tracking-wide opacity-60 text-sm leading-relaxed max-w-xl mx-auto">
              Our pieces carry the weight of visibility. We lead with art, follow with purpose, and finish with real human connection.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
