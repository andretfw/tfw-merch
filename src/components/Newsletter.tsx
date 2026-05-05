import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState, FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-32 px-8 md:px-12 bg-white border-t border-brand-black/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-8">Stay Seen</h3>
          <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Join the Inner Circle</h2>
          <p className="text-brand-accent max-w-sm mx-auto opacity-60 mb-12 italic">
            Receive early access to new artwork series and limited wearable releases.
          </p>

          {subscribed ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-brand-berry font-serif italic text-xl"
            >
              You are now seen. Welcome.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="flex-1 bg-brand-cream border border-brand-black/10 px-6 py-4 text-xs uppercase tracking-widest focus:outline-none focus:border-brand-black transition-colors"
              />
              <button 
                type="submit"
                className="bg-brand-black text-white px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 hover:bg-brand-berry transition-all group"
              >
                Join
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
