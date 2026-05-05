import { Star, Shield, Cloud } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Artwork First",
    text: "Each piece begins with a visual story.",
    icon: Star
  },
  {
    title: "Made to Be Seen",
    text: "Bold details designed to carry presence.",
    icon: Shield
  },
  {
    title: "Everyday Premium",
    text: "Soft silhouettes created for real life.",
    icon: Cloud
  }
];

export default function ProductExperience() {
  return (
    <section className="py-24 px-8 md:px-12 bg-brand-cream border-t border-brand-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center md:text-left space-y-6"
            >
              <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl border border-brand-black/5 mx-auto md:mx-0">
                <feature.icon size={20} className="text-brand-berry" />
              </div>
              <div>
                <h4 className="text-xl font-serif italic mb-3">{feature.title}</h4>
                <p className="text-xs text-brand-accent opacity-60 tracking-wider leading-relaxed">{feature.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
