import { motion } from "motion/react";
import { useEffect, useState } from "react";

const events = [
  {
    name: "Times Square",
    images: ["/images/TIMES SQUARE.JPG", "/images/times square.png"],
  },
  {
    name: "NFT.NYC",
    images: ["/images/nftnyc2025.png"],
  },
  {
    name: "NFC Lisbon",
    images: ["/images/NFC LISBON.JPG", "/images/NFC LISBON.jpeg"],
  },
  {
    name: "WebX Asia",
    images: ["/images/WEBX TFW.JPG"],
  },
  {
    name: "BitBasel",
    images: [],
  },
];

function EventCard({
  event,
  index,
}: {
  event: {
    name: string;
    images: string[];
  };
  index: number;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (event.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % event.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [event.images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.7 }}
      viewport={{ once: true }}
      className="group bg-white/60 border border-brand-black/5 p-5 md:p-6 hover:bg-white transition-all duration-500"
    >
      <div className="aspect-[4/3] bg-brand-cream overflow-hidden relative mb-7">
        {event.images.length > 0 ? (
          event.images.map((image, imageIndex) => (
            <motion.img
              key={image}
              src={image}
              alt={event.name}
              initial={false}
              animate={{
                opacity: currentImage === imageIndex ? 1 : 0,
                scale: currentImage === imageIndex ? 1 : 1.04,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 transition-all duration-700"
            />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">
              TFW
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/[0.03] transition-colors" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl md:text-3xl font-serif italic group-hover:text-brand-berry transition-colors">
          {event.name}
        </h3>

        {event.images.length > 1 && (
          <div className="flex gap-1.5">
            {event.images.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentImage(dotIndex)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImage === dotIndex
                    ? "bg-brand-black scale-125"
                    : "bg-brand-black/20"
                }`}
                aria-label={`Show ${event.name} image ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SeenOnSection() {
  return (
    <section
      id="seen"
      className="py-32 px-8 md:px-12 bg-brand-cream border-y border-brand-black/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-8">
            Where the Art <br /> Has Been Seen
          </h2>

          <p className="text-brand-accent max-w-xl mx-auto opacity-70">
            Tutti Frutti Women artwork has appeared across international events,
            digital screens and creative spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, index) => (
            <EventCard key={event.name} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
