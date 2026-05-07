import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

interface PrintifyVariant {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  variants: PrintifyVariant[];
}

export default function FeaturedProducts({
  filterCategory,
  onClearFilter,
  onOpenCheckout,
}: {
  filterCategory: string | null;
  onClearFilter: () => void;
  onOpenCheckout: () => void;
}) {
  const [products, setProducts] = useState<PrintifyProduct[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/.netlify/functions/printify-products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load Printify products.");
        }

        const loadedProducts: PrintifyProduct[] = data.products || [];
        setProducts(loadedProducts);

        const defaults: Record<string, number> = {};

        loadedProducts.forEach((product) => {
          if (product.variants?.length > 0) {
            defaults[product.id] = product.variants[0].id;
          }
        });

        setSelectedVariants(defaults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const cleanDescription = (html: string) => {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  const getCategory = (title: string) => {
    const lower = title.toLowerCase();

    if (lower.includes("hoodie")) return "Hoodies";
    if (lower.includes("sweatshirt")) return "Sweatshirts";
    if (lower.includes("tee") || lower.includes("tshirt") || lower.includes("t-shirt")) return "T-Shirts";
    if (lower.includes("long sleeve")) return "Long Sleeves";

    return "Wearables";
  };

  const getVariantInfo = (variantTitle: string) => {
    const parts = variantTitle.split(" / ").map((part) => part.trim());

    return {
      size: parts[0] || "Default",
      color: parts[1] || "Default",
    };
  };

  const filtered = products.filter((product) => {
    if (!filterCategory) return true;

    const cat = filterCategory.toLowerCase().replace(/s$/, "");
    return getCategory(product.title).toLowerCase().includes(cat);
  });

  const handleAddToCart = (product: PrintifyProduct) => {
    const selectedVariantId = selectedVariants[product.id];

    const selectedVariant =
      product.variants.find((variant) => variant.id === selectedVariantId) ||
      product.variants[0];

    if (!selectedVariant) {
      alert("This product has no available variants.");
      return;
    }

    const { size, color } = getVariantInfo(selectedVariant.title);

    addToCart(
      {
        id: `${product.id}-${selectedVariant.id}`,
        name: product.title,
        description: cleanDescription(product.description).slice(0, 160),
        price: selectedVariant.price,
        image: product.image,
        category: getCategory(product.title),
        featured: true,
        printifyProductId: product.id,
        printifyVariantId: selectedVariant.id,
      } as any,
      size,
      color,
      1
    );
  };

  const handleOrderNow = (product: PrintifyProduct) => {
    handleAddToCart(product);
    onOpenCheckout();
  };

  return (
    <section id="shop" className="py-32 px-8 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif italic mb-6">
              {filterCategory ? `The ${filterCategory} Selection` : "Featured Pieces"}
            </h2>

            <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-30">
              {filterCategory
                ? `Pieces currently available in the ${filterCategory.toLowerCase()} collection.`
                : "Bold artwork. Clean silhouettes. Made to be worn."}
            </p>
          </motion.div>

          {filterCategory && (
            <button
              onClick={onClearFilter}
              className="text-[10px] uppercase tracking-widest font-bold border-b border-brand-black pb-1 hover:opacity-50 transition-opacity"
            >
              Back to Featured
            </button>
          )}
        </div>

        {loading && (
          <div className="py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
              Loading pieces from Printify...
            </p>
          </div>
        )}

        {error && (
          <div className="py-20 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="font-serif italic text-2xl opacity-40">
              The collection is currently in the archives.
            </p>

            {filterCategory && (
              <button
                onClick={onClearFilter}
                className="mt-8 text-[10px] uppercase tracking-widest font-bold border-brand-black border px-6 py-3"
              >
                Show All Featured
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            {filtered.map((product, index) => {
              const selectedVariantId = selectedVariants[product.id];

              const selectedVariant =
                product.variants.find((variant) => variant.id === selectedVariantId) ||
                product.variants[0];

              const description = cleanDescription(product.description);
              const category = getCategory(product.title);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.7 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-brand-cream aspect-[4/5] overflow-hidden mb-8 border border-brand-black/5">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">
                          TFW
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-3">
                          {category}
                        </p>

                        <h3 className="text-2xl font-serif italic leading-tight">
                          {product.title}
                        </h3>
                      </div>

                      <p className="text-lg font-serif whitespace-nowrap">
                        €{selectedVariant?.price || product.price}
                      </p>
                    </div>

                    {description && (
                      <p className="text-sm text-brand-accent opacity-60 leading-relaxed">
                        {description.slice(0, 130)}...
                      </p>
                    )}

                    {product.variants.length > 0 && (
                      <div className="pt-2">
                        <label className="block text-[9px] uppercase tracking-[0.25em] font-bold opacity-30 mb-3">
                          Size / Color
                        </label>

                        <select
                          value={selectedVariantId || ""}
                          onChange={(event) =>
                            setSelectedVariants((prev) => ({
                              ...prev,
                              [product.id]: Number(event.target.value),
                            }))
                          }
                          className="w-full bg-transparent border border-brand-black/10 px-4 py-3 text-xs uppercase tracking-widest focus:outline-none"
                        >
                          {product.variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.title} — €{variant.price}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 pt-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-4 bg-brand-black text-white uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 hover:bg-brand-berry transition-colors"
                      >
                        Add to Bag
                        <ShoppingBag size={14} />
                      </button>

                      <button
                        onClick={() => handleOrderNow(product)}
                        className="w-full py-4 border border-brand-black/20 text-brand-black uppercase tracking-[0.2em] font-bold text-[10px] hover:border-brand-black transition-colors"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
