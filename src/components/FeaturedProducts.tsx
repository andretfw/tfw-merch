import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

const series = [
  {
    slug: "seen",
    name: "The Seen Series",
    line: "For the ones who refused to disappear quietly.",
  },
  {
    slug: "brave",
    name: "The Brave Series",
    line: "For the quiet kind of brave. The kind nobody claps for, but everything depends on.",
  },
  {
    slug: "chaotic",
    name: "The Chaotic Series",
    line: "For the ones who turned the mess into identity.",
  },
  {
    slug: "fruit-loop",
    name: "The Fruit Loop Series",
    line: "For the colorful ones. The fruity ones. The beautifully unbothered.",
  },
];

const genderFilters = ["All", "Women", "Men", "Unisex"];

function cleanDescription(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseProductTitle(title: string) {
  const parts = title.split("|").map((part) => part.trim());

  if (parts.length >= 3) {
    return {
      seriesName: parts[0],
      gender: parts[1],
      displayName: parts.slice(2).join(" | "),
    };
  }

  return {
    seriesName: "Archive Pieces",
    gender: "Unisex",
    displayName: title,
  };
}

function getSeriesSlug(seriesName: string) {
  const lower = seriesName.toLowerCase();

  if (lower.includes("seen")) return "seen";
  if (lower.includes("brave")) return "brave";
  if (lower.includes("chaos") || lower.includes("chaotic")) return "chaotic";
  if (lower.includes("fruit")) return "fruit-loop";

  return "archive";
}

function getVariantInfo(variantTitle: string) {
  const parts = variantTitle.split(" / ").map((part) => part.trim());

  return {
    size: parts[0] || "Default",
    color: parts[1] || "Default",
  };
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
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState("All");
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

  const productsWithMeta = useMemo(() => {
    return products.map((product) => {
      const parsed = parseProductTitle(product.title);
      const seriesSlug = getSeriesSlug(parsed.seriesName);

      return {
        ...product,
        displayName: parsed.displayName,
        gender: parsed.gender,
        seriesName: parsed.seriesName,
        seriesSlug,
      };
    });
  }, [products]);

  const visibleProducts = productsWithMeta.filter((product) => {
    const matchesSeries = selectedSeries ? product.seriesSlug === selectedSeries : true;

    const matchesGender =
      selectedGender === "All"
        ? true
        : product.gender.toLowerCase() === selectedGender.toLowerCase();

    return matchesSeries && matchesGender;
  });

  const getSeriesCount = (slug: string) => {
    return productsWithMeta.filter((product) => product.seriesSlug === slug).length;
  };

  const getSeriesImage = (slug: string) => {
    return productsWithMeta.find((product) => product.seriesSlug === slug)?.image;
  };

  const handleAddToCart = (product: any) => {
    const selectedVariantId = selectedVariants[product.id];

    const selectedVariant =
      product.variants.find((variant: PrintifyVariant) => variant.id === selectedVariantId) ||
      product.variants[0];

    if (!selectedVariant) {
      alert("This product has no available variants.");
      return;
    }

    const { size, color } = getVariantInfo(selectedVariant.title);

    addToCart(
      {
        id: `${product.id}-${selectedVariant.id}`,
        name: product.displayName,
        description: cleanDescription(product.description).slice(0, 160),
        price: selectedVariant.price,
        image: product.image,
        category: product.seriesName,
        featured: true,
        printifyProductId: product.id,
        printifyVariantId: selectedVariant.id,
      } as any,
      size,
      color,
      1
    );
  };

  const handleOrderNow = (product: any) => {
    handleAddToCart(product);
    onOpenCheckout();
  };

  const currentSeries = series.find((item) => item.slug === selectedSeries);

  return (
    <section id="shop" className="py-32 px-8 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {!selectedSeries ? (
          <>
            <div className="mb-20 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-serif italic mb-8"
              >
                Limited Series
              </motion.h2>

              <p className="text-brand-accent max-w-xl mx-auto opacity-70">
                Each drop begins with original TFW artwork and becomes a limited wearable statement.
              </p>
            </div>

            {loading && (
              <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
                Loading series...
              </p>
            )}

            {error && (
              <p className="text-center text-sm text-red-600">
                {error}
              </p>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {series.map((item, index) => {
                  const image = getSeriesImage(item.slug);
                  const count = getSeriesCount(item.slug);

                  return (
                    <motion.button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        setSelectedSeries(item.slug);
                        setSelectedGender("All");
                      }}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.7 }}
                      viewport={{ once: true }}
                      className="group text-left bg-brand-cream/50 border border-brand-black/5 p-5 hover:bg-brand-cream transition-all duration-500"
                    >
                      <div className="aspect-[4/5] bg-white overflow-hidden mb-8 border border-brand-black/5">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">
                              Coming Soon
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4">
                        {count > 0 ? `${count} pieces` : "Coming soon"}
                      </p>

                      <h3 className="text-3xl font-serif italic mb-4 group-hover:text-brand-berry transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-sm text-brand-accent opacity-60 leading-relaxed">
                        {item.line}
                      </p>

                      <p className="mt-8 text-[10px] uppercase tracking-[0.3em] font-bold">
                        Enter Series →
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-16 text-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedSeries(null);
                  setSelectedGender("All");
                }}
                className="mb-10 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-opacity"
              >
                ← Back to Limited Series
              </button>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-serif italic mb-8"
              >
                {currentSeries?.name}
              </motion.h2>

              <p className="text-brand-accent max-w-xl mx-auto opacity-70">
                {currentSeries?.line}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {genderFilters.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setSelectedGender(gender)}
                  className={`px-6 py-3 text-[10px] uppercase tracking-[0.25em] font-bold border transition-all ${
                    selectedGender === gender
                      ? "bg-brand-black text-white border-brand-black"
                      : "border-brand-black/10 text-brand-black/50 hover:border-brand-black hover:text-brand-black"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>

            {visibleProducts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-serif italic text-2xl opacity-40">
                  No pieces in this selection yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
                {visibleProducts.map((product, index) => {
                  const selectedVariantId = selectedVariants[product.id];

                  const selectedVariant =
                    product.variants.find((variant) => variant.id === selectedVariantId) ||
                    product.variants[0];

                  const description = cleanDescription(product.description);

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
                            alt={product.displayName}
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
                              {product.gender}
                            </p>

                            <h3 className="text-2xl font-serif italic leading-tight">
                              {product.displayName}
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
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="w-full py-4 bg-brand-black text-white uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 hover:bg-brand-berry transition-colors"
                          >
                            Add to Bag
                            <ShoppingBag size={14} />
                          </button>

                          <button
                            type="button"
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
          </>
        )}
      </div>
    </section>
  );
}
