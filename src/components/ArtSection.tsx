import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const artworks = [
  {
    src: "/images/73.png",
    caption: "Tutti Frutti Women 73 — inspired by a bold, brave, and beautiful warrior.",
  },
  {
    src: "/images/44.png",
    caption: "Tutti Frutti Women 44 — art made to be seen, worn, and remembered.",
  },
  {
    src: "/images/67.png",
    caption: "Tutti Frutti Women 67 — visibility, courage, and beauty in one piece.",
  },
  {
    src: "/images/358.png",
    caption: "Tutti Frutti Women 358 — from original artwork to wearable statement.",
  },
];

export default function ArtSection() {
  const [currentArtwork, setCurrentArtwork] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArtwork((prev) => (prev + 1) % artworks.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="art" className="py-32 px-8 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-md"
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-8">
            The Philosophy
          </h3>

          <h2 className="text-5xl md:text-7xl font-serif leading-none mb-12 italic">
            The Art <br /> Behind <br /> the Pieces
          </h2>

          <p className="text-2xl font-serif italic text-brand-berry mb-8 leading-tight">
            “Before it was worn, it was seen.”
          </p>

          <p className="text-brand-accent leading-relaxed mb-12">
            Every piece begins with Tutti Frutti Women artwork: bold, brave and
            created around visibility, courage, and beauty.
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
            <div className="aspect-[4/5] bg-brand-cream overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={artworks[currentArtwork].src}
                  src={artworks[currentArtwork].src}
                  alt="TFW Artwork"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                />
              </AnimatePresence>
            </div>

            <div className="mt-8 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={artworks[currentArtwork].caption}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="font-serif italic text-sm"
                >
                  {artworks[currentArtwork].caption}
                </motion.p>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-5">
                {artworks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentArtwork(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentArtwork === index
                        ? "bg-brand-black scale-125"
                        : "bg-brand-black/20"
                    }`}
                    aria-label={`Show artwork ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -z-10 -top-20 -right-20 w-80 h-80 bg-brand-blush/30 rounded-full blur-[100px]" />
        </motion.div>
      </div>
    </section>
  );
}
