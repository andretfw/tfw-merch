import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Header({ cartCount }: { cartCount: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Shop", href: "#shop" },
    { name: "The Art", href: "#art" },
    { name: "Seen On", href: "#seen" },
    { name: "Story", href: "#story" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-xl py-3 border-b border-brand-black/5" : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-8 md:px-12 flex items-center justify-between">
        <div className="flex-1 md:flex items-center gap-10 hidden">
          {navLinks.slice(0, 3).map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black hover:opacity-50 transition-opacity"
            >
              {link.name}
            </a>
          ))}
        </div>

        <a href="/" className="flex-shrink-0">
          <span className="font-serif italic text-2xl font-semibold tracking-tighter text-brand-black">Tutti Frutti Women</span>
        </a>

        <div className="flex-1 flex items-center justify-end gap-10">
          <div className="hidden md:flex items-center gap-10">
            {navLinks.slice(3).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-black hover:opacity-50 transition-opacity"
              >
                {link.name}
              </a>
            ))}
          </div>
          <button className="relative p-2 text-brand-black group">
            <ShoppingBag size={20} strokeWidth={1} />
            <span className="absolute top-1 right-0 w-4 h-4 bg-brand-black text-white text-[8px] font-bold flex items-center justify-center rounded-full transition-transform group-hover:scale-110">
              {cartCount}
            </span>
          </button>
          <button className="md:hidden p-2 text-brand-black" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-40 bg-white"
          >
            <div className="flex flex-col h-full p-12">
              <div className="flex justify-between items-center mb-20">
                <span className="font-serif italic text-2xl font-semibold">TFW</span>
                <button onClick={() => setIsOpen(false)}>
                  <X size={32} strokeWidth={1} />
                </button>
              </div>
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-4xl font-serif italic link-underline w-fit"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="mt-auto pt-12 border-t border-brand-black/5">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4">Follow the Art</p>
                <div className="flex gap-8 text-sm">
                  <a href="#">Instagram</a>
                  <a href="#">TikTok</a>
                  <a href="#">X</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
