import { useState, useEffect } from "react";
import { X, Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";

type Promotion = {
  id: number;
  title: string;
  description?: string | null;
  info_text?: string | null;
  image_url?: string | null;
  discount_text?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  active: boolean;
};

// Non-intrusive bottom-slide toast — replaces full-screen blocking popup
export default function DiscountToast() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/promotions`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0) {
          setPromotions(data);
          // Show after 8s delay — not immediately on load
          setTimeout(() => setIsVisible(true), 8000);
        }
      } catch {
        // Silently ignore
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (!promotions.length || dismissed) return;
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length);
        setIsVisible(true);
      }, 600);
    }, 25000);
    return () => clearInterval(timer);
  }, [promotions, dismissed]);

  if (!promotions.length || dismissed) return null;
  const promo = promotions[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="discount-toast"
          role="status"
          aria-live="polite"
        >
          {/* Flash icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-safari-gold/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-safari-gold" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {promo.discount_text && (
              <span className="text-safari-gold text-xs font-bold tracking-wider uppercase">{promo.discount_text}</span>
            )}
            <p className="text-safari-cream font-semibold text-sm leading-snug truncate">{promo.title}</p>
            {promo.description && (
              <p className="text-safari-sand/70 text-xs mt-0.5 line-clamp-1">{promo.description}</p>
            )}
          </div>

          {/* CTA */}
          <Link
            to={promo.button_link || "/booking"}
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-safari-gold hover:bg-safari-gold/85 text-safari-charcoal text-xs font-bold transition-colors"
          >
            {promo.button_text || "Book Now"}
            <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Dismiss */}
          <button
            onClick={() => { setIsVisible(false); setDismissed(true); }}
            className="flex-shrink-0 p-1.5 rounded-full hover:bg-safari-warm-brown/50 text-safari-sand/60 hover:text-safari-sand transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
