import { motion } from "motion/react";

interface CurrentEditPiece {
  id: string;
  seriesSlug: "fruity" | "beautiful-mess";
  series: string;
  gender: string;
  name: string;
  image: string;
  price: string;
}

const currentEditPieces: CurrentEditPiece[] = [
  {
    id: "its-fine",
    seriesSlug: "beautiful-mess",
    series: "The Beautiful Mess",
    gender: "Unisex",
    name: "It's Fine",
    image: "/images/products/its-fine/hoodie/black-back.png",
    price: "€34.99",
  },
  {
    id: "too-perfect",
    seriesSlug: "beautiful-mess",
    series: "The Beautiful Mess",
    gender: "Women",
    name: "Too Perfect",
    image: "/images/products/too-perfect/all-over-print-tshirt/white-front.png",
    price: "€34.99",
  },
  {
    id: "bearing-my-own-fruit",
    seriesSlug: "fruity",
    series: "Fruity",
    gender: "Unisex",
    name: "Bearing My Own Fruit Hoodie",
    image: "/images/products/bearing-my-own-fruit/hoodie/navy-front.png",
    price: "€50",
  },
  {
    id: "world-better",
    seriesSlug: "fruity",
    series: "Fruity",
    gender: "Unisex",
    name: "The World Looks Better With You In It",
    image: "/images/products/world-better/long-tee/white-front.png",
    price: "€34.99",
  },
];

export default function CategorySection({
  onSelectCategory,
}: {
  onSelectCategory: (cat: string) => void;
}) {
  const openSeries = (seriesSlug: CurrentEditPiece["seriesSlug"]) => {
    onSelectCategory("");

    window.history.pushState({}, "", `#shop-${seriesSlug}`);
    window.dispatchEvent(new Event("hashchange"));

    const shopSection = document.getElementById("shop");
    shopSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExplore = () => {
    onSelectCategory("");

    window.history.pushState({}, "", "#shop");
    window.dispatchEvent(new Event("hashchange"));

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {currentEditPieces.map((piece, index) => (
            <motion.button
              key={piece.id}
              type="button"
              onClick={() => openSeries(piece.seriesSlug)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.7 }}
              viewport={{ once: true }}
              className="group text-left bg-white/70 border border-brand-black/5 p-5 hover:bg-white transition-all duration-500"
            >
              <div className="aspect-[3/4] bg-white overflow-hidden mb-8 border border-brand-black/5 flex items-center justify-center p-4">
                <img
                  src={piece.image}
                  alt={piece.name}
                  className="w-full h-full object-contain grayscale-[0.08] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                />
              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4">
                {piece.series} · {piece.gender}
              </p>

              <h3 className="text-2xl font-serif italic mb-3 group-hover:text-brand-berry transition-colors">
                {piece.name}
              </h3>

              <p className="text-sm text-brand-accent opacity-60">
                {piece.price}
              </p>
            </motion.button>
          ))}
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
      </div>
    </section>
  );
}
