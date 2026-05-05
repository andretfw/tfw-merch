import { motion } from "motion/react";

const faqs = [
  { q: "When will my order ship?", a: "Each piece is printed to order to ensure the highest artwork quality. Expected shipping is 5-10 business days." },
  { q: "What sizes are available?", a: "Most of our apparel is available from XS up to XXL. Our T-shirts have a relaxed classic fit, while hoodies are more structured." },
  { q: "Are the pieces limited?", a: "Yes. Our collections feature specific artwork that rotates. Once an artwork series is archived, it may not return to the store." },
  { q: "Can I return or exchange an item?", a: "Because our items are printed fresh for each order, we can only offer returns for faulty or damaged goods. Please consult our sizing guide carefully." },
  { q: "How should I wash the apparel?", a: "To preserve the artwork, wash cold inside out and air dry. This keeps the print bold and the fabric soft for years." },
  { q: "What payment methods are accepted?", a: "We accept all major credit cards, Apple Pay, Google Pay, and PayPal through our secure checkout system." },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-32 px-8 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-8 text-brand-black">Concerns</h3>
          <h2 className="text-5xl md:text-6xl font-serif italic text-brand-black">Common Inquiries</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="text-lg font-serif italic flex items-center gap-4">
                <span className="text-[9px] uppercase tracking-widest font-bold opacity-20">0{index + 1}</span>
                {faq.q}
              </h4>
              <p className="text-xs text-brand-accent leading-relaxed opacity-60 ml-8 italic">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
