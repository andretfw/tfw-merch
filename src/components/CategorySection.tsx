import { motion } from "motion/react";

const edits = [
  {
    label: "Current Edit",
    name: "The Seen Piece",
    line: "For the ones who refuse to disappear quietly.",
    image: "/images/seen-series.png",
  },
  {
    label: "Quiet Power",
    name: "The Brave Piece",
    line: "Soft strength, clean lines, and a little emotional damage.",
    image: "/images/brave-series.png",
  },
  {
    label: "Most Wanted",
    name: "The Chaotic Piece",
    line: "For the ones who turned the mess into identity.",
    image: "/images/chaotic-series.png",
  },
  {
    label: "Tutti Energy",
    name: "The Fruit Loop Piece",
    line: "Colorful, playful, and beautifully unbothered.",
    image: "/images/fruit-loop-series.png",
  },
];

export default function CategorySection({
  onSelectCategory,
}: {
  onSelectCategory: (cat: string) => void;
}) {
  const handleExplore = () => {
    onSelectCategory("");

    const shopSection = document.getElementById("shop");
    shopSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-32 px-8 md:px-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] font-bold opacity-30 mb-6">
            Not basics. Not categories.
          </p>

          <h2 className="text-4xl md:text-6xl font-serif italic mb-8">
            The Current Edit
          </h2>

          <p className="text-brand-accent max-w-xl mx-auto opacity-70">
            A small rotation of pieces we would wear first — selected from the
            limited TFW series.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {edits.map((edit, index) => (
            <motion.button
              key={edit.name}
              type="button"
              onClick={handleExplore}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group bg-white/60 border border-brand-black/5 p-5 text-left hover:bg-white transition-all duration-500"
            >
              <div className="aspect-[3/4] bg-brand-cream overflow-hidden mb-8 border border-brand-black/5">
                <img
                  src={edit.image}
                  alt={edit.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4">
                {edit.label}
              </p>

              <h3 className="text-3xl font-serif italic mb-4 group-hover:text-brand-berry transition-colors">
                {edit.name}
              </h3>

              <p className="text-sm text-brand-accent opacity-60 leading-relaxed">
                {edit.line}
              </p>

              <p className="mt-8 text-[10px] uppercase tracking-[0.3em] font-bold">
                Explore Limited Series →
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
