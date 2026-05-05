import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";

export default function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
      id="main-header"
      className="fixed top-0 left-0 right-0 z-50 flex flex-col"
    >
      {/* Announcement Bar */}
      <div className={`bg-brand-black text-white py-2 px-6 overflow-hidden border-b border-white/10 transition-all duration-500 ${scrolled ? 'h-0 py-0 opacity-0 border-none' : 'h-auto opacity-100'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium">
            Limited pieces featuring Tutti Frutti Women artwork.
          </p>
        </div>
      </div>

      {/* Nav Bar */}
      <nav 
        className={`transition-all duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-xl py-2 shadow-sm border-b border-brand-black/5" : "bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
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
            <span className="font-serif italic text-xl md:text-2xl font-semibold tracking-tighter text-brand-black">TFW</span>
          </a>

          <div className="flex-1 flex items-center justify-end gap-2 md:gap-10">
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
            <button 
              id="mobile-cart-btn"
              onClick={onOpenCart}
              className="relative p-3 text-brand-black group z-[60]"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute top-2 right-1 w-4 h-4 bg-brand-black text-white text-[8px] font-bold flex items-center justify-center rounded-full transition-transform group-hover:scale-110">
                {totalItems}
              </span>
            </button>
            <button 
              id="mobile-menu-btn"
              className="md:hidden p-3 text-brand-black z-[60]" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-brand-cream"
          >
            <div className="flex flex-col h-full p-8 md:p-12 pt-12 md:pt-24">
              <div className="flex justify-between items-center mb-12 md:hidden">
                <span className="font-serif italic text-xl font-semibold">TFW</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-4xl md:text-5xl font-serif italic link-underline w-fit"
                    onClick={() => setIsMenuOpen(false)}
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
