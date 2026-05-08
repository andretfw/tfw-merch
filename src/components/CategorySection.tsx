import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface PrintifyVariant {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  variants: PrintifyVariant[];
}

function cleanTitle(title: string) {
  const parts = title.split("|").map((part) => part.trim());

  if (parts.length >= 3) {
    return {
      series: parts[0],
      gender: parts[1],
      name: parts.slice(2).join(" | "),
    };
  }

  return {
    series: "TFW Piece",
    gender: "Wearable Art",
    name: title,
  };
}

export default function CategorySection({
  onSelectCategory,
}: {
  onSelectCategory: (cat: string) => void;
}) {
  const [pieces, setPieces] = useState<PrintifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPieces() {
      try {
        const response = await fetch("/.netlify/functions/printify-products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        setPieces((data.products || []).slice(0, 4));
      } catch {
        setPieces([]);
      } finally {
        setLoading(false);
      }
    }

    loadPieces();
  }, []);

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
            A few pieces we would wear first
          </p>

          <h2 className="text-4xl md:text-6xl font-serif italic mb-8">
            The Current Edit
          </h2>

          <p className="text-brand-accent max-w-xl mx-auto opacity-70">
            A small selection from the latest TFW wearable art drops.
          </p>
        </div>

        {loading && (
          <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
            Loading current pieces...
          </p>
        )}

        {!loading && pieces.length === 0 && (
          <div className="text-center py-12">
            <p className="font-serif italic text-2xl opacity-40">
              The edit is being curated.
            </p>

            <button
              type="button"
              onClick={handleExplore}
              className="mt-8 text-[10px] uppercase tracking-[0.3em] font-bold border border-brand-black px-8 py-4 hover:bg-brand-black hover:text-white transition-colors"
            >
              Explore Limited Series
            </button>
          </div>
        )}

        {!loading && pieces.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {pieces.map((piece, index) => {
                const title = cleanTitle(piece.title);
                const firstVariant = piece.variants?.[0];
                const price = firstVariant?.price || piece.price;

                return (
                  <motion.button
                    key={piece.id}
                    type="button"
                    onClick={handleExplore}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.7 }}
                    viewport={{ once: true }}
                    className="group text-left bg-white/60 border border-brand-black/5 p-5 hover:bg-white transition-all duration-500"
                  >
                    <div className="aspect-[3/4] bg-brand-cream overflow-hidden mb-8 border border-brand-black/5">
                      {piece.image ? (
                        <img
                          src={piece.image}
                          alt={title.name}
                          className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">
                            TFW
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4">
                      {title.series} · {title.gender}
                    </p>

                    <h3 className="text-2xl font-serif italic mb-3 group-hover:text-brand-berry transition-colors">
                      {title.name}
                    </h3>

                    <p className="text-sm text-brand-accent opacity-60">
                      €{price}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <button
                type="button"
                onClick={handleExplore}
                className="px-10 py-5 bg-brand-black text-white text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-brand-berry transition-colors"
              >
                Explore Limited Series
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
