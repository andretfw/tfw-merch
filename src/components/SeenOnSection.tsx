import { motion } from "motion/react";

const events = [
  { name: "Times Square", date: "June 2023", desc: "Digital takeover." },
  { name: "NFT.NYC", date: "April 2023", desc: "Main stage showcase." },
  { name: "NFC Lisbon", date: "June 2023", desc: "Curated gallery wall." },
  { name: "WebX Asia", date: "July 2023", desc: "Keynote installation." },
  { name: "BitBasel", date: "Dec 2023", desc: "Creative partner room." },
  { name: "Shiba Fest", date: "Sept 2023", desc: "Featured community pop-up." }
];

export default function SeenOnSection() {
  return (
    <section id="seen" className="py-32 px-8 md:px-12 bg-brand-cream border-y border-brand-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Where the Art <br /> Has Been Seen</h2>
          <p className="text-brand-accent max-w-xl mx-auto opacity-70">
            Tutti Frutti Women artwork has appeared across international events, digital screens and creative spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {events.map((event, index) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group border border-brand-black/5 p-8 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-500"
            >
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-6">{event.date}</h4>
              <h3 className="text-3xl font-serif italic mb-4 group-hover:text-brand-berry transition-colors">{event.name}</h3>
              <p className="text-xs text-brand-accent italic opacity-60">{event.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
