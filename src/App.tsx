import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import CategorySection from "./components/CategorySection";
import ArtSection from "./components/ArtSection";
import SeenOnSection from "./components/SeenOnSection";
import StorySection from "./components/StorySection";
import ProductExperience from "./components/ProductExperience";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import Newsletter from "./components/Newsletter";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  return (
    <CartProvider>
      <div className="min-h-screen bg-brand-cream selection:bg-brand-berry selection:text-white transition-colors duration-500">
        <AnnouncementBar />
        <Header onOpenCart={() => setIsCartOpen(true)} />

        <main>
          <Hero />
          <FeaturedProducts 
            filterCategory={filterCategory} 
            onClearFilter={() => setFilterCategory(null)} 
          />
          <CategorySection onSelectCategory={(cat) => setFilterCategory(cat)} />
          <ArtSection />
          <SeenOnSection />
          <StorySection />
          <ProductExperience />
          <Newsletter />
          <FAQ />
        </main>

        <Footer />

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      </div>
    </CartProvider>
  );
}
