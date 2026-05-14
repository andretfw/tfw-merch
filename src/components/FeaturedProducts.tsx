import { motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  X,
  ZoomIn,
} from "lucide-react";
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

interface ManualProductConfig {
  slug: string;
  productType: string;
  seriesSlug: "fruity" | "beautiful-mess";
  seriesName: string;
  displayName: string;
  gender: string;
  description: string;
  match: string[];
  colors: Record<string, ProductImage[]>;
}

interface ProductWithMeta extends PrintifyProduct {
  displayName: string;
  gender: string;
  seriesName: string;
  seriesSlug: string;
  manualConfig: ManualProductConfig;
}

interface ZoomState {
  images: ProductImage[];
  index: number;
  title: string;
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

const manualProductConfigs: ManualProductConfig[] = [
  {
    slug: "dont-shrink",
    productType: "oversize-cotton",
    seriesSlug: "fruity",
    seriesName: "Fruity",
    displayName: "Don't shrink",
    gender: "Unisex",
    description: "A limited TFW wearable art piece from the Fruity Series.",
    match: ["dont shrink", "don t shrink"],
    colors: {
      white: [
        {
          src: "/images/products/dont-shrink/oversize-cotton/white-front.png",
          position: "front",
          is_default: true,
        },
        {
          src: "/images/products/dont-shrink/oversize-cotton/white-back.png",
          position: "back",
          is_default: false,
        },
      ],
    },
  },
  {
    slug: "world-better",
    productType: "long-tee",
    seriesSlug: "fruity",
    seriesName: "Fruity",
    displayName: "The World Looks Better With You In It",
    gender: "Unisex",
    description:
      "Heavyweight oversized cotton t-shirt. A limited TFW wearable art piece made to remind someone they matter.",
    match: [
      "world is better with you in it",
      "the world is better with you in it",
    ],
    colors: {
      white: [
        {
          src: "/images/products/world-better/long-tee/white-front.png",
          position: "front",
          is_default: true,
        },
        {
          src: "/images/products/world-better/long-tee/white-back.png",
          position: "back",
          is_default: false,
        },
      ],
    },
  },
];

function cleanDescription(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getManualProductConfig(title: string) {
  const normalizedTitle = normalizeText(title);

  return manualProductConfigs.find((config) =>
    config.match.some((term) => normalizedTitle.includes(normalizeText(term)))
  );
}

function getColorFromVariantTitle(variantTitle: string) {
  const normalized = normalizeText(variantTitle);

  const colors = [
    "ice grey",
    "ice gray",
    "light pink",
    "white",
    "black",
    "pink",
    "cream",
    "natural",
    "beige",
    "grey",
    "gray",
    "navy",
  ];

  const found = colors.find((color) => normalized.includes(normalizeText(color)));

  if (!found) return "default";
  if (found === "ice gray" || found === "ice grey") return "ice-grey";
  if (found === "light pink") return "light-pink";
  if (found === "gray") return "grey";

  return normalizeText(found).replace(/\s+/g, "-");
}

function getSizeFromVariantTitle(variantTitle: string) {
  const parts = variantTitle.split(" / ").map((part) => part.trim());

  const knownSize = parts.find((part) => {
    const normalized = part.toLowerCase();
    return ["xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl"].includes(
      normalized
    );
  });

  if (knownSize) return knownSize.toUpperCase();

  const normalized = normalizeText(variantTitle);
  const sizeMatch = normalized.match(/\b(xs|s|m|l|xl|2xl|3xl|4xl|5xl)\b/i);

  return sizeMatch ? sizeMatch[0].toUpperCase() : parts[0] || "Default";
}

function getVariantInfo(variantTitle: string) {
  const color = getColorFromVariantTitle(variantTitle);
  const size = getSizeFromVariantTitle(variantTitle);

  return {
    size,
    color: color === "default" ? "Default" : color,
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

function orderGalleryImages(galleryImages: ProductImage[]) {
  return [...galleryImages].sort((a, b) => {
    if (a.is_default && !b.is_default) return -1;
    if (!a.is_default && b.is_default) return 1;
    if (a.position === "front" && b.position !== "front") return -1;
    if (a.position !== "front" && b.position === "front") return 1;
    return 0;
  });
}

function getManualImagesForVariant(
  product: ProductWithMeta,
  selectedVariant?: PrintifyVariant
) {
  const color = selectedVariant
    ? getColorFromVariantTitle(selectedVariant.title)
    : "white";

  return (
    product.manualConfig.colors[color] ||
    product.manualConfig.colors.white ||
    Object.values(product.manualConfig.colors)[0] ||
    []
  );
}

function getGalleryImages(
  product: ProductWithMeta,
  selectedVariant?: PrintifyVariant
) {
  const manualImages = getManualImagesForVariant(product, selectedVariant);

  if (manualImages.length > 0) {
    return orderGalleryImages(uniqueImages(manualImages));
  }

  const variantImages = selectedVariant?.images || [];
  const productImages = product.images || [];

  return orderGalleryImages(
    uniqueImages([
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
    ])
  );
}

function filterVariantsWithManualImages(product: ProductWithMeta) {
  const allowedColors = Object.keys(product.manualConfig.colors);

  const filtered = (product.variants || []).filter((variant) => {
    const color = getColorFromVariantTitle(variant.title);
    return allowedColors.includes(color);
  });

  return filtered.length > 0 ? filtered : product.variants || [];
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
  const [zoom, setZoom] = useState<ZoomState | null>(null);

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

        setProducts(data.products || []);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!zoom) return;

      if (event.key === "Escape") {
        setZoom(null);
      }

      if (event.key === "ArrowRight") {
        setZoom((current) => {
          if (!current) return current;
          return {
            ...current,
            index: (current.index + 1) % current.images.length,
          };
        });
      }

      if (event.key === "ArrowLeft") {
        setZoom((current) => {
          if (!current) return current;
          return {
            ...current,
            index:
              current.index === 0
                ? current.images.length - 1
                : current.index - 1,
          };
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoom]);

  const productsWithMeta = useMemo(() => {
    const curatedProducts = products
      .map((product): ProductWithMeta | null => {
        const manualConfig = getManualProductConfig(product.title);

        if (!manualConfig) return null;

        const productWithMeta: ProductWithMeta = {
          ...product,
          displayName: manualConfig.displayName,
          gender: manualConfig.gender,
          seriesName: manualConfig.seriesName,
          seriesSlug: manualConfig.seriesSlug,
          description: manualConfig.description,
          manualConfig,
        };

        return {
          ...productWithMeta,
          variants: filterVariantsWithManualImages(productWithMeta),
        };
      })
      .filter(Boolean) as ProductWithMeta[];

    return curatedProducts;
  }, [products]);

  useEffect(() => {
    const defaultVariants: Record<string, number> = {};
    const defaultImages: Record<string, string> = {};

    productsWithMeta.forEach((product) => {
      if (product.variants?.length > 0) {
        const firstVariant = product.variants[0];
        const galleryImages = getGalleryImages(product, firstVariant);

        defaultVariants[product.id] = firstVariant.id;
        defaultImages[product.id] =
          galleryImages[0]?.src ||
          firstVariant.image ||
          firstVariant.images?.[0]?.src ||
          product.image ||
          "";
      } else {
        const galleryImages = getGalleryImages(product);

        defaultImages[product.id] =
          galleryImages[0]?.src || product.image || product.images?.[0]?.src || "";
      }
    });

    setSelectedVariants(defaultVariants);
    setSelectedImages(defaultImages);
  }, [productsWithMeta]);

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

  const openZoom = (images: ProductImage[], selectedImage: string, title: string) => {
    const orderedImages = orderGalleryImages(uniqueImages(images));
    const selectedIndex = orderedImages.findIndex(
      (image) => image.src === selectedImage
    );

    setZoom({
      images: orderedImages,
      index: selectedIndex >= 0 ? selectedIndex : 0,
      title,
    });
  };

  const handleVariantChange = (product: ProductWithMeta, variantId: number) => {
    const selectedVariant =
      product.variants.find((variant) => variant.id === variantId) ||
      product.variants[0];

    const galleryImages = getGalleryImages(product, selectedVariant);

    setSelectedVariants((prev) => ({
      ...prev,
      [product.id]: variantId,
    }));

    setSelectedImages((prev) => ({
      ...prev,
      [product.id]:
        galleryImages[0]?.src ||
        selectedVariant?.image ||
        selectedVariant?.images?.[0]?.src ||
        product.image ||
        "",
    }));
  };

  const handleAddToCart = (product: ProductWithMeta) => {
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

    const galleryImages = getGalleryImages(product, selectedVariant);

    const cartImage =
      selectedImages[product.id] ||
      galleryImages[0]?.src ||
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

  const handleOrderNow = (product: ProductWithMeta) => {
    handleAddToCart(product);
    onOpenCheckout();
  };

  const currentSeries = series.find((item) => item.slug === selectedSeries);

  const zoomModal = zoom ? (
    <div className="fixed inset-0 z-[9999] bg-black/95 text-white">
      <button
        type="button"
        onClick={() => setZoom(null)}
        className="absolute top-5 right-5 z-20 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Close image zoom"
      >
        <X size={22} />
      </button>

      <div className="h-full w-full flex flex-col">
        <div className="px-6 pt-6 pr-20">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-bold">
            Product view
          </p>

          <h3 className="mt-2 text-2xl md:text-4xl font-serif italic">
            {zoom.title}
          </h3>
        </div>

        <div className="relative flex-1 flex items-center justify-center px-4 md:px-20 py-6">
          {zoom.images.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setZoom((current) => {
                  if (!current) return current;

                  return {
                    ...current,
                    index:
                      current.index === 0
                        ? current.images.length - 1
                        : current.index - 1,
                  };
                })
              }
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Previous product image"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <img
            src={zoom.images[zoom.index]?.src}
            alt={`${zoom.title} large view`}
            className="max-h-[72vh] max-w-full object-contain"
          />

          {zoom.images.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setZoom((current) => {
                  if (!current) return current;

                  return {
                    ...current,
                    index: (current.index + 1) % current.images.length,
                  };
                })
              }
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Next product image"
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>

        {zoom.images.length > 1 && (
          <div className="px-4 md:px-10 pb-6">
            <div className="flex gap-3 overflow-x-auto justify-start md:justify-center">
              {zoom.images.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() =>
                    setZoom((current) =>
                      current ? { ...current, index } : current
                    )
                  }
                  className={`h-20 w-20 shrink-0 bg-white rounded-sm border p-1 transition-all ${
                    zoom.index === index
                      ? "border-white opacity-100"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                  aria-label={`Open product image ${index + 1}`}
                >
                  <img
                    src={image.src}
                    alt={`${zoom.title} thumbnail ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  if (selectedSeries && currentSeries) {
    return (
      <>
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
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
                {visibleProducts.map((product, index) => {
                  const selectedVariantId = selectedVariants[product.id];

                  const selectedVariant =
                    product.variants.find(
                      (variant) => variant.id === selectedVariantId
                    ) || product.variants[0];

                  const galleryImages = getGalleryImages(product, selectedVariant);

                  const selectedImage =
                    selectedImages[product.id] ||
                    galleryImages[0]?.src ||
                    selectedVariant?.image ||
                    selectedVariant?.images?.[0]?.src ||
                    product.image ||
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
                      <button
                        type="button"
                        onClick={() =>
                          openZoom(galleryImages, selectedImage, product.displayName)
                        }
                        className="relative w-full bg-white aspect-[4/5] overflow-hidden mb-4 border border-brand-black/5 flex items-center justify-center p-2 md:p-3 cursor-zoom-in"
                        aria-label={`Zoom ${product.displayName}`}
                      >
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

                        <span className="absolute bottom-3 right-3 bg-white/90 text-brand-black text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn size={13} />
                          Zoom
                        </span>
                      </button>

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

        {zoomModal}
      </>
    );
  }

  return (
    <>
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
              Two moods. One universe. Wearable art for the colorful, the soft,
              the loud, and the beautifully complicated.
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

      {zoomModal}
    </>
  );
}
