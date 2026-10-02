// Jude Safaris and Adventures - Executive Merch Store
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Check,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { MERCH_PRODUCTS, MERCH_CATEGORIES, MerchProduct } from "@/features/merch/data";
import { useSEO } from "@/hooks/use-seo";
import { WHATSAPP_URL, PHONE_DISPLAY } from "@/lib/brand";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Shop = () => {
  useSEO({
    title: "Official Merch & Van Culture Gear | Jude Safaris and Adventures",
    description:
      "Shop limited-edition Jude Safaris executive safari bombers, vacuum tumblers, handcrafted Samburu leather duffels, and Nganya culture apparel.",
    path: "/shop",
    keywords: [
      "Jude Safaris merch",
      "safari apparel Kenya",
      "Nganya gear",
      "waxed canvas duffel",
      "executive safari van clothing",
    ],
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [addedNotify, setAddedNotify] = useState<string | null>(null);

  // Cart store
  const { items, isOpen, toggleCart, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice } =
    useCartStore();

  const filteredProducts =
    selectedCategory === "All"
      ? MERCH_PRODUCTS
      : MERCH_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleSelectColor = (productId: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleAddToCart = (product: MerchProduct) => {
    const size = product.sizes ? selectedSizes[product.id] || product.sizes[0] : undefined;
    const color = product.colors ? selectedColors[product.id] || product.colors[0].name : undefined;

    addItem({
      id: product.id,
      name: product.name,
      price: currency === "KES" ? product.priceKES : Math.round(product.priceUSD * 128),
      image: product.images[0],
      size,
      color,
    });

    setAddedNotify(product.name);
    setTimeout(() => setAddedNotify(null), 3000);
  };

  const formatPrice = (kes: number, usd: number) => {
    if (currency === "USD") {
      return `$${usd}`;
    }
    return `KES ${kes.toLocaleString()}`;
  };

  // Build WhatsApp order link for cart
  const buildWhatsAppCartOrder = () => {
    if (items.length === 0) return WHATSAPP_URL;
    let message = "Habari Jude Safaris! I want to order official merch:\n\n";
    items.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (x${item.quantity})\n`;
      if (item.size) message += `   Size: ${item.size}\n`;
      if (item.color) message += `   Color: ${item.color}\n`;
      message += `   KES ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Total Amount:* KES ${totalPrice().toLocaleString()}\n`;
    message += `Please confirm delivery details in Kenya / International dispatch.`;
    return `https://wa.me/254422832791?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-safari-charcoal text-safari-cream pt-24 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {addedNotify && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50 bg-emerald-600/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 border border-emerald-400/40"
          >
            <Check className="w-5 h-5 text-emerald-200" />
            <div>
              <p className="text-xs text-emerald-200 uppercase tracking-widest font-semibold">Added to Cart</p>
              <p className="text-sm font-medium">{addedNotify}</p>
            </div>
            <button onClick={() => toggleCart()} className="ml-3 underline text-xs text-white/90 hover:text-white">
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <section className="relative py-16 overflow-hidden border-b border-safari-gold/15 bg-gradient-to-b from-safari-charcoal via-safari-charcoal to-black">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.25em] bg-safari-gold/10 text-safari-gold border border-safari-gold/25 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Nganya Couture & Expedition Gear
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight mb-4 text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-safari-gold via-amber-200 to-safari-gold">Safari Collection</span>
            </h1>
            <p className="text-safari-sand/80 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8">
              Executive van aesthetics crafted for rugged savannah dawns and bold Nairobi nights. Each piece supports Kenyan artisans.
            </p>

            {/* Currency & Cart Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center p-1 bg-safari-warm-brown/60 rounded-xl border border-safari-gold/20">
                <button
                  onClick={() => setCurrency("KES")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === "KES"
                      ? "bg-safari-gold text-safari-charcoal shadow-md"
                      : "text-safari-sand hover:text-white"
                  }`}
                >
                  KES (KSh)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currency === "USD"
                      ? "bg-safari-gold text-safari-charcoal shadow-md"
                      : "text-safari-sand hover:text-white"
                  }`}
                >
                  USD ($)
                </button>
              </div>

              <Button
                onClick={toggleCart}
                variant="outline"
                className="relative gap-2 border-safari-gold/30 bg-black/40 text-safari-cream hover:bg-safari-gold hover:text-safari-charcoal transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-safari-gold" />
                <span>My Bag</span>
                {totalItems() > 0 && (
                  <span className="bg-safari-gold text-safari-charcoal text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {totalItems()}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Nav */}
      <section className="py-6 sticky top-20 z-20 bg-safari-charcoal/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {MERCH_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-safari-gold text-safari-charcoal shadow-lg shadow-safari-gold/10 font-bold"
                  : "bg-safari-warm-brown/40 text-safari-sand/80 hover:bg-safari-warm-brown hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, idx) => {
            const currentSize = product.sizes ? selectedSizes[product.id] || product.sizes[0] : null;
            const currentColor = product.colors ? selectedColors[product.id] || product.colors[0].name : null;

            return (
              <motion.div
                key={product.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                className="group flex flex-col bg-safari-warm-brown/30 rounded-2xl overflow-hidden border border-safari-gold/15 hover:border-safari-gold/45 hover:shadow-2xl hover:shadow-safari-gold/5 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/4] overflow-hidden bg-black/40">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-safari-gold text-safari-charcoal text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-safari-sand text-xs px-2.5 py-1 rounded-md border border-white/10">
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-safari-gold text-xs mb-2">
                    <Star className="w-3.5 h-3.5 fill-safari-gold" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-safari-sand/50">({product.reviewsCount})</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-safari-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-safari-sand/70 text-xs mb-4 line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Color Swatches */}
                  {product.colors && (
                    <div className="mb-4">
                      <span className="text-[11px] uppercase tracking-wider text-safari-sand/60 block mb-1.5">
                        Color: <span className="text-white font-medium">{currentColor}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        {product.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => handleSelectColor(product.id, c.name)}
                            title={c.name}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              currentColor === c.name
                                ? "ring-2 ring-safari-gold ring-offset-2 ring-offset-safari-charcoal scale-110 border-white"
                                : "border-white/20 opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selector */}
                  {product.sizes && (
                    <div className="mb-4">
                      <span className="text-[11px] uppercase tracking-wider text-safari-sand/60 block mb-1.5">
                        Select Size
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSelectSize(product.id, s)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentSize === s
                                ? "bg-safari-gold text-safari-charcoal shadow-sm"
                                : "bg-black/40 text-safari-sand border border-white/10 hover:border-safari-gold/40"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & Add to Bag */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-safari-sand/50 block">Price</span>
                      <span className="text-xl font-display font-black text-white">
                        {formatPrice(product.priceKES, product.priceUSD)}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="gap-2 bg-safari-gold text-safari-charcoal hover:bg-amber-400 font-bold px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Brand Value Props */}
      <section className="border-t border-safari-gold/15 py-14 bg-black/30">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-safari-warm-brown/20 border border-white/5">
            <Truck className="w-8 h-8 text-safari-gold mx-auto mb-3" />
            <h4 className="font-display font-bold text-white text-base mb-1">Pan-African & Global Dispatch</h4>
            <p className="text-safari-sand/70 text-xs">Direct courier delivery in Nairobi within 24h. DHL express worldwide.</p>
          </div>
          <div className="p-6 rounded-2xl bg-safari-warm-brown/20 border border-white/5">
            <ShieldCheck className="w-8 h-8 text-safari-gold mx-auto mb-3" />
            <h4 className="font-display font-bold text-white text-base mb-1">100% Authentic Kenyan Craft</h4>
            <p className="text-safari-sand/70 text-xs">Collaborations with Samburu and Maasai community artisans directly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-safari-warm-brown/20 border border-white/5">
            <CreditCard className="w-8 h-8 text-safari-gold mx-auto mb-3" />
            <h4 className="font-display font-bold text-white text-base mb-1">M-Pesa & Card Secure Checkout</h4>
            <p className="text-safari-sand/70 text-xs">Instant M-Pesa STK push for East Africa + encrypted Visa / MasterCard.</p>
          </div>
        </div>
      </section>

      {/* Cart Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-safari-charcoal border-l border-safari-gold/25 z-50 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-safari-gold/15 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-safari-gold" />
                  <h3 className="font-display font-bold text-lg text-white">Your Safari Bag</h3>
                  <span className="text-xs bg-safari-gold/20 text-safari-gold px-2 py-0.5 rounded-full font-bold">
                    {totalItems()} items
                  </span>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-2 rounded-lg text-safari-sand hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="w-16 h-16 text-safari-sand/20 mx-auto mb-4" />
                    <p className="text-white font-display font-semibold mb-1">Your bag is empty</p>
                    <p className="text-safari-sand/60 text-xs max-w-xs mx-auto mb-6">
                      Explore our executive Nganya jackets, safari flasks, and handcrafted Samburu duffels.
                    </p>
                    <Button
                      onClick={toggleCart}
                      variant="outline"
                      className="border-safari-gold/40 text-safari-gold hover:bg-safari-gold hover:text-safari-charcoal text-xs"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex gap-4 p-4 rounded-xl bg-safari-warm-brown/30 border border-white/5 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-black/40 border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-display font-bold text-white truncate">{item.name}</h4>
                        <div className="text-xs text-safari-sand/60 flex items-center gap-2 mt-0.5">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• {item.color}</span>}
                        </div>
                        <p className="text-xs font-bold text-safari-gold mt-1">
                          KES {item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1, item.size, item.color)}
                          className="p-1 hover:text-white text-safari-sand transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1, item.size, item.color)}
                          className="p-1 hover:text-white text-safari-sand transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="p-1.5 text-safari-sand/50 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-safari-gold/20 bg-black/60 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-safari-sand">Subtotal</span>
                    <span className="font-display font-extrabold text-xl text-white">
                      KES {totalPrice().toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-safari-sand/60">
                    Taxes calculated at dispatch. Nairobi courier complimentary on orders over KES 10,000.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* WhatsApp Fast Order */}
                    <a
                      href={buildWhatsAppCartOrder()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 rounded-xl shadow-lg shadow-emerald-900/30">
                        <Phone className="w-4 h-4" /> Order Instantly via WhatsApp
                      </Button>
                    </a>

                    <Button
                      onClick={() => {
                        alert(
                          `Jude Safaris M-Pesa Checkout\nTotal: KES ${totalPrice().toLocaleString()}\n\nTo complete payment, please confirm your order on WhatsApp (+254 422 832 791) or call our executive desk.`
                        );
                      }}
                      variant="outline"
                      className="w-full gap-2 border-safari-gold/40 text-safari-gold hover:bg-safari-gold hover:text-safari-charcoal py-5 font-bold rounded-xl"
                    >
                      <CreditCard className="w-4 h-4" /> Pay with M-Pesa / Card
                    </Button>
                  </div>

                  <button
                    onClick={clearCart}
                    className="text-xs text-safari-sand/50 hover:text-rose-400 w-full text-center block pt-1"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;