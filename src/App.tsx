import { useState } from "react";
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

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-berry selection:text-white transition-colors duration-500">
      <AnnouncementBar />
      <Header cartCount={cartCount} />

      <main>
        <Hero />
        <FeaturedProducts onAddToCart={handleAddToCart} />
        <CategorySection />
        <ArtSection />
        <SeenOnSection />
        <StorySection />
        <ProductExperience />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
