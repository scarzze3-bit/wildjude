// Jude Safaris and Adventures - Navbar (header visibility fixed)
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND, LOGO_URL } from "@/lib/brand";
import { useCartStore } from "@/stores/cartStore";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Destinations", path: "/destinations" },
  { name: "Packages", path: "/packages" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

// Pages with a full-bleed hero image at the top — navbar starts transparent
const HERO_PAGES = ["/", "/destinations", "/about"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const isHeroPage = HERO_PAGES.includes(location.pathname);
  // Transparent only on hero pages when not scrolled
  const isTransparent = isHeroPage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    // Reset on route change so non-hero pages always start solid
    setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent py-5"
          : "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/40 py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={LOGO_URL}
            alt={BRAND.name + " Logo"}
            className="w-10 h-10 md:w-11 md:h-11 object-cover object-left rounded-full shadow-md border-2 border-safari-gold/60 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_hsl(42_95%_52%/0.5)] bg-white"
          />
          <div className="flex flex-col leading-tight">
            <span className={`text-lg md:text-xl font-display font-bold tracking-tight transition-colors leading-none ${isTransparent ? "text-white drop-shadow-md" : "text-foreground"}`}>
              Jude <span className="text-safari-gold">Safaris</span>
            </span>
            <span className={`text-[10px] tracking-[0.18em] uppercase font-body font-medium transition-colors ${isTransparent ? "text-white/70" : "text-muted-foreground"}`}>
              & Adventures
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-all duration-200 relative group ${
                location.pathname === link.path
                  ? "text-safari-gold"
                  : isTransparent
                  ? "text-white hover:text-safari-gold"
                  : "text-foreground hover:text-safari-gold"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-0.5 left-0 h-px bg-safari-gold transition-all duration-300 ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>
          ))}

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-safari-gold/10 transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingBag className={`w-5 h-5 ${isTransparent ? "text-white" : "text-foreground"}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-safari-gold text-[10px] font-bold text-safari-charcoal flex items-center justify-center animate-pulse-gold">
                {totalItems}
              </span>
            )}
          </button>

          <Link to="/booking">
            <Button variant="default" size="sm" className="gap-2 bg-safari-gold hover:bg-safari-gold/90 text-safari-charcoal font-semibold rounded-full px-5">
              <Phone className="w-3.5 h-3.5" />
              Book Safari
            </Button>
          </Link>
        </div>

        {/* Mobile: Cart + Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button onClick={toggleCart} className="relative p-2" aria-label="Cart">
            <ShoppingBag className={`w-5 h-5 ${isTransparent ? "text-white" : "text-foreground"}`} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-safari-gold text-[9px] font-bold text-safari-charcoal flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 transition-colors rounded-lg ${isTransparent ? "text-white" : "text-foreground hover:bg-muted"}`}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-background/98 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center py-3 px-4 rounded-xl text-base font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-safari-gold/10 text-safari-gold"
                      : "text-foreground hover:bg-muted hover:text-safari-gold"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/booking" className="mt-3">
                <Button className="w-full gap-2 bg-safari-gold hover:bg-safari-gold/90 text-safari-charcoal font-semibold rounded-full">
                  <Phone className="w-4 h-4" />
                  Book Safari
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;