import { Instagram, Twitter, Smartphone as TikTok } from "lucide-react";

export default function Footer() {
  const links = [
    { name: "Shop", href: "#shop" },
    { name: "The Art", href: "#art" },
    { name: "Seen On", href: "#seen" },
    { name: "Story", href: "#story" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ];

  return (
    <footer className="bg-brand-cream border-t border-brand-black/5 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-32">
          <div className="max-w-xs">
            <a href="/" className="font-serif italic text-3xl font-semibold mb-8 block">
              Tutti Frutti Women
            </a>
            <p className="text-brand-accent text-sm leading-relaxed italic opacity-70 mb-10">
              “Made for the bold, the brave & the beautiful.”
            </p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-berry transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-brand-berry transition-colors"><Twitter size={20} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-brand-berry transition-colors"><TikTok size={20} strokeWidth={1.5} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 flex-grow">
            {['Shop', 'Art', 'Brand', 'Support'].map((section, idx) => (
              <div key={section}>
                <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-black opacity-30 mb-8">{section}</h4>
                <ul className="space-y-4">
                  {links.slice(idx * 2, (idx + 1) * 2).map(link => (
                    <li key={link.name}>
                      <a href={link.href} className="text-[10px] uppercase tracking-widest font-bold hover:text-brand-berry transition-colors">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-brand-black/5 gap-8">
          <div className="flex gap-12 text-[9px] font-bold uppercase tracking-widest opacity-40">
            <span>© 2024 Tutti Frutti Women</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex gap-8 text-[9px] font-bold uppercase tracking-widest opacity-40 italic">
            <span>tuttifruttiwomen.shop</span>
            <span className="hidden md:inline">•</span>
            <span>Created with Courage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
