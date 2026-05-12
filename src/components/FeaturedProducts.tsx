import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

interface ProductImage {
  src: string;
  variant_ids?: number[];
  position?: string;
  is_default?: boolean;
}

interface PrintifyVariant {
  id: number;
  title: string;
  price: number;
  is_enabled: boolean;
  image?: string;
  images?: ProductImage[];
  provider?: "printify" | "printful";
  printifyVariantId?: number | string;
  printfulVariantId?: number | string;
}

interface PrintifyProduct {
  id: string;
  provider?: "printify" | "printful";
  originalProductId?: string;
  title: string;
  description: string;
  image: string;
  images?: ProductImage[];
  price: number;
  variants: PrintifyVariant[];
}

const series = [
  {
    slug: "fruity",
    name: "The Fruity Series",
    line: "For the colorful ones growing into themselves, loudly and beautifully.",
    cover: "/images/fruity-series.png",
  },
  {
    slug: "beautiful-mess",
    name: "The Beautiful Mess Series",
    line: "For the ones turning chaos, softness, and survival into a whole mood.",
    cover: "/images/beautiful-mess-series.png",
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

  if (
    lower.includes("fruity") ||
    lower.includes("fruit") ||
    lower.includes("fruit loop")
  ) {
    return "fruity";
  }

  if (
    lower.includes("beautiful mess") ||
    lower.includes("messy") ||
    lower.includes("mess") ||
    lower.includes("chaos") ||
    lower.includes("chaotic") ||
    lower.includes("seen") ||
    lower.includes("brave")
  ) {
    return "beautiful-mess";
  }

  return "archive";
}

function getVariantInfo(variantTitle: string) {
  const parts = variantTitle.split(" / ").map((part) => part.trim());

  return {
    size: parts[0] || "Default",
    color: parts[1] || "Default",
  };
}

function uniqueImages(images: ProductImage[]) {
  const seen = new Set<string>();

  return images
    .filter((image) => image?.src)
    .filter((image) => {
      if (seen.has(image.src)) return false;
      seen.add(image.src);
      return true;
    });
}

function getGalleryImages(product: PrintifyProduct, selectedVariant?: PrintifyVariant) {
  const variantImages = selectedVariant?.images || [];
  const productImages = product.images || [];

  return uniqueImages([
    ...variantImages,
    ...(selectedVariant?.image
      ? [
          {
            src: selectedVariant.image,
            position: "front",
            is_default: true,
          },
        ]
      : []),
    ...(product.image
      ? [
          {
            src: product.image,
            position: "front",
            is_default: true,
          },
        ]
      : []),
    ...productImages,
  ]);
}

function looksLikeModelImage(image: ProductImage) {
  const src = image.src.toLowerCase();
  const position = (image.position || "").toLowerCase();

  return (
    src.includes("model") ||
    src.includes("lifestyle") ||
    src.includes("person") ||
    src.includes("wear") ||
    src.includes("mockup") ||
    position.includes("model") ||
    position.includes("lifestyle")
  );
}

function getPreferredMainImage(galleryImages: ProductImage[]) {
  if (galleryImages.length === 0) return "";

  const modelImage = galleryImages.find(looksLikeModelImage);

  if (modelImage?.src) {
    return modelImage.src;
  }

  // Fallback for your current gallery order:
  // logo/art often appear first, model often appears around the 3rd image.
  if (galleryImages.length >= 3) {
    return galleryImages[2].src;
  }

  return galleryImages[0].src;
}

function orderGalleryImages(galleryImages: ProductImage[]) {
  const preferredSrc = getPreferredMainImage(galleryImages);

  if (!preferredSrc) return galleryImages;

  const preferred = galleryImages.find((image) => image.src === preferredSrc);
  const rest = galleryImages.filter((image) => image.src !== preferredSrc);

  return preferred ? [preferred, ...rest] : galleryImages;
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
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>({});
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState("All");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const { addToCart } = useCart();

  void filterCategory;
  void onClearFilter;

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setApiError("");

        const response = await fetch("/.netlify/functions/printify-products");
        const rawText = await response.text();

        let data;

        try {
          data = JSON.parse(rawText);
        } catch {
          throw new Error(
            "The product endpoint returned HTML instead of JSON. Check the Netlify function deployment."
          );
        }

        if (!response.ok) {
          throw new Error(data.error || "Could not load products.");
        }

        const loadedProducts: PrintifyProduct[] = data.products || [];
        setProducts(loadedProducts);

        const defaultVariants: Record<string, number> = {};
        const defaultImages: Record<string, string> = {};

        loadedProducts.forEach((product) => {
          if (product.variants?.length > 0) {
            const firstVariant = product.variants[0];
            const galleryImages = getGalleryImages(product, firstVariant);
            const orderedGalleryImages = orderGalleryImages(galleryImages);

            defaultVariants[product.id] = firstVariant.id;
            defaultImages[product.id] =
              getPreferredMainImage(orderedGalleryImages) ||
              firstVariant.image ||
              firstVariant.images?.[0]?.src ||
              product.image ||
              product.images?.[0]?.src ||
              "";
          } else {
            const galleryImages = getGalleryImages(product);
            const orderedGalleryImages = orderGalleryImages(galleryImages);

            defaultImages[product.id] =
              getPreferredMainImage(orderedGalleryImages) ||
              product.image ||
              product.images?.[0]?.src ||
              "";
          }
        });

        setSelectedVariants(defaultVariants);
        setSelectedImages(defaultImages);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Something went wrong.");
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
    const matchesSeries = selectedSeries
      ? product.seriesSlug === selectedSeries
      : true;

    const matchesGender =
      selectedGender === "All"
        ? true
        : product.gender.toLowerCase() === selectedGender.toLowerCase();

    return matchesSeries && matchesGender;
  });

  const getSeriesCount = (slug: string) => {
    return productsWithMeta.filter((product) => product.seriesSlug === slug).length;
  };

  const handleVariantChange = (product: any, variantId: number) => {
    const selectedVariant =
      product.variants.find((variant: PrintifyVariant) => variant.id === variantId) ||
      product.variants[0];

    const galleryImages = getGalleryImages(product, selectedVariant);
    const orderedGalleryImages = orderGalleryImages(galleryImages);

    setSelectedVariants((prev) => ({
      ...prev,
      [product.id]: variantId,
    }));

    setSelectedImages((prev) => ({
      ...prev,
      [product.id]:
        getPreferredMainImage(orderedGalleryImages) ||
        selectedVariant?.image ||
        selectedVariant?.images?.[0]?.src ||
        product.image ||
        "",
    }));
  };

  const handleAddToCart = (product: any) => {
    const selectedVariantId = selectedVariants[product.id];

    const selectedVariant =
      product.variants.find(
        (variant: PrintifyVariant) => variant.id === selectedVariantId
      ) || product.variants[0];

    if (!selectedVariant) {
      alert("This product has no available variants.");
      return;
    }

    const { size, color } = getVariantInfo(selectedVariant.title);

    const cartImage =
      selectedImages[product.id] ||
      selectedVariant.image ||
      selectedVariant.images?.[0]?.src ||
      product.image;

    addToCart(
      {
        id: `${product.id}-${selectedVariant.id}`,
        name: product.displayName,
        description: cleanDescription(product.description).slice(0, 160),
        price: selectedVariant.price,
        image: cartImage,
        category: product.seriesName,
        featured: true,

        provider: product.provider,
        originalProductId: product.originalProductId,

        printifyProductId:
          product.provider === "printify" ? product.originalProductId : undefined,

        printifyVariantId:
          product.provider === "printify"
            ? selectedVariant.printifyVariantId || selectedVariant.id
            : undefined,

        printfulVariantId:
          product.provider === "printful"
            ? selectedVariant.printfulVariantId || selectedVariant.id
            : undefined,
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

  if (selectedSeries && currentSeries) {
    return (
      <section id="shop" className="py-32 px-8 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center relative z-10">
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
              key={currentSeries.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif italic mb-8"
            >
              {currentSeries.name}
            </motion.h2>

            <p className="text-brand-accent max-w-xl mx-auto opacity-70">
              {currentSeries.line}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-10">
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

          {apiError && (
            <div className="py-10 text-center">
              <p className="text-sm text-red-600 max-w-xl mx-auto">{apiError}</p>
            </div>
          )}

          {!apiError && visibleProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif italic text-2xl opacity-40">
                No pieces in this selection yet.
              </p>

              <p className="mt-4 text-sm text-brand-accent opacity-50">
                <span className="font-bold">
                  {currentSeries.name} | Women | Product Name
                </span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
              {visibleProducts.map((product, index) => {
                const selectedVariantId = selectedVariants[product.id];

                const selectedVariant =
                  product.variants.find(
                    (variant) => variant.id === selectedVariantId
                  ) || product.variants[0];

                const galleryImages = orderGalleryImages(
                  getGalleryImages(product, selectedVariant)
                );

                const selectedImage =
                  selectedImages[product.id] ||
                  getPreferredMainImage(galleryImages) ||
                  selectedVariant?.image ||
                  selectedVariant?.images?.[0]?.src ||
                  product.image ||
                  galleryImages[0]?.src ||
                  "";

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
                    <div className="bg-white aspect-[4/5] overflow-hidden mb-4 border border-brand-black/5 flex items-center justify-center p-2 md:p-3">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt={product.displayName}
                          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-cream">
                          <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-20">
                            TFW
                          </span>
                        </div>
                      )}
                    </div>

                    {galleryImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 mb-8">
                        {galleryImages.slice(0, 8).map((image, imageIndex) => (
                          <button
                            key={`${product.id}-${image.src}-${imageIndex}`}
                            type="button"
                            onClick={() =>
                              setSelectedImages((prev) => ({
                                ...prev,
                                [product.id]: image.src,
                              }))
                            }
                            className={`aspect-square overflow-hidden border bg-white p-1 transition-all ${
                              selectedImage === image.src
                                ? "border-brand-black opacity-100"
                                : "border-brand-black/10 opacity-55 hover:opacity-100"
                            }`}
                            aria-label={`View image ${imageIndex + 1} for ${product.displayName}`}
                          >
                            <img
                              src={image.src}
                              alt={`${product.displayName} view ${imageIndex + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    )}

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
                              handleVariantChange(product, Number(event.target.value))
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
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-32 px-8 md:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
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
            Two moods. One universe. Wearable art for the colorful, the soft, the loud, and the beautifully complicated.
          </p>

          {loading && (
            <p className="mt-8 text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">
              Loading pieces...
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {series.map((item, index) => {
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
                <div className="aspect-[4/5] bg-white overflow-hidden mb-8 border border-brand-black/5 flex items-center justify-center p-2">
                  <img
                    src={item.cover}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    className="w-full h-full object-contain grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                  />
                </div>

                <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4">
                  {count > 0 ? `${count} pieces` : "Limited drop"}
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
      </div>
    </section>
  );
}
