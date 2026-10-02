import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";
import { KENYA_CIRCUITS, DESTINATION_REGIONS, DESTINATION_TAGS, DESTINATION_IMAGES, KenyaCircuit } from "@/features/destinations/data";
import { WHATSAPP_MESSAGE } from "@/lib/brand";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" },
  }),
};

const Destinations = () => {
  useSEO({
    title: "Kenya Safari Destinations | Jude Safaris & Adventures",
    description:
      "Explore curated Kenyan circuits: Lake Victoria, Homa Bay, Baringo, Mombasa Coast, and the Northern Frontier with Jude Safaris luxury vans.",
    path: "/destinations",
    keywords: ["Kenya safari destinations", "Lake Victoria safari", "Samburu", "Mombasa tours", "Baringo hot springs"],
  });

  const [activeRegion, setActiveRegion] = useState("All");
  const [activeTag, setActiveTag] = useState("All");

  const filtered = KENYA_CIRCUITS.filter((d) => {
    const regionMatch = activeRegion === "All" || d.region === activeRegion;
    const tagMatch = activeTag === "All" || d.tags.some((t) => t === activeTag);
    return regionMatch && tagMatch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-32 pt-40 overflow-hidden bg-safari-charcoal">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1518982380512-5a3c6f6f5218?w=1600)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-safari-charcoal/60 via-safari-charcoal/80 to-safari-charcoal" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="label-safari mb-4">
            Kenyan Circuits
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-safari-cream mb-5">
            Our <span className="italic text-gradient-gold">Destinations</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-safari-sand/80 max-w-2xl mx-auto text-lg leading-relaxed">
            Five curated Kenyan circuits — each with its own pulse, its own story.
            Driven in custom luxury Nganya vans built for the wild.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mr-1">Region:</span>
              {DESTINATION_REGIONS.map((r) => (
                <button key={r} onClick={() => setActiveRegion(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeRegion === r ? "bg-safari-gold text-safari-charcoal shadow-md" : "bg-muted text-muted-foreground hover:bg-safari-gold/10 hover:text-safari-gold"
                  }`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mr-1">Type:</span>
              {DESTINATION_TAGS.map((t) => (
                <button key={t} onClick={() => setActiveTag(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeTag === t ? "bg-safari-emerald text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-safari-emerald/10 hover:text-safari-emerald"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-10 h-10 text-safari-gold/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No destinations match. Try clearing your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((dest: KenyaCircuit, i) => (
                <motion.article
                  key={dest.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="group relative rounded-2xl overflow-hidden border border-border hover:border-safari-gold/40 hover:shadow-2xl hover:shadow-safari-gold/10 transition-all duration-500 h-[420px] flex flex-col"
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    <img
                      src={DESTINATION_IMAGES[dest.id] || "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800"}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-safari-charcoal via-safari-charcoal/40 to-transparent" />
                  </div>

                  {/* Tags */}
                  <div className="relative z-10 flex flex-wrap gap-2 p-5">
                    {dest.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="bg-safari-charcoal/60 backdrop-blur-sm text-safari-cream text-[10px] px-2.5 py-1 rounded-full font-medium border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 mt-auto p-6">
                    <div className="flex items-center gap-2 text-safari-gold text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="font-medium">{dest.county}, Kenya</span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-safari-cream mb-2 group-hover:text-safari-gold transition-colors">
                      {dest.name}
                    </h2>
                    <p className="text-safari-sand/80 text-sm mb-3 leading-relaxed">{dest.tagline}</p>
                    <p className="text-safari-sand/60 text-xs italic mb-4 font-display line-clamp-2">
                      "{dest.culturalQuote}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-safari-sand/70 text-xs">
                          <Calendar className="w-3 h-3" />
                          {dest.bestMonths}
                        </div>
                        <div className="text-safari-gold font-price font-bold text-base mt-1">
                          From KES {dest.priceFrom.toLocaleString()}
                        </div>
                      </div>
                      <a
                        href={WHATSAPP_MESSAGE(dest.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-safari-gold text-sm font-semibold hover:text-safari-cream transition-colors group/cta"
                      >
                        Book Now
                        <ChevronRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Highlights Banner */}
      <section className="py-16 bg-safari-charcoal">
        <div className="container mx-auto px-4 text-center">
          <p className="label-safari mb-4">Every Circuit Includes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { label: "Custom Nganya Van", icon: "🚐" },
              { label: "Expert Guide", icon: "🧭" },
              { label: "Cultural Immersion", icon: "🎭" },
              { label: "Flexible Itinerary", icon: "📍" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-safari-warm-brown/40 hover:border-safari-gold/40 transition-colors">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-safari-sand/80 text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Destinations;
