export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  category: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "signature-hoodie",
    name: "Signature Hoodie",
    description: "Soft, structured and designed around bold feminine artwork.",
    price: 72,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200",
    colors: ["Off-white", "Midnight", "Berry"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Hoodies",
    featured: true
  },
  {
    id: "oversized-artwork-tee",
    name: "Oversized Artwork Tee",
    description: "A relaxed everyday piece with artwork that carries presence.",
    price: 42,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200",
    colors: ["Parchment", "Carbon"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "T-Shirts",
    featured: true
  },
  {
    id: "essential-sweatshirt",
    name: "Essential Sweatshirt",
    description: "Minimal comfort with a refined artwork finish.",
    price: 64,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&q=80&w=1200",
    colors: ["Soft Lavender", "Stone"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Sweatshirts",
    featured: true
  },
  {
    id: "long-sleeve-artwork-top",
    name: "Long Sleeve Artwork Top",
    description: "Lightweight, effortless and made for layering.",
    price: 48,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1200",
    colors: ["Cream", "Deep Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Long Sleeves",
    featured: true
  }
];
