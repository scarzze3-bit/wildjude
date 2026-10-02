// Jude Safaris and Adventures - Executive Packages Catalog
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ShieldCheck, MapPin, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";
import { useSEO } from "@/hooks/use-seo";
import { WHATSAPP_URL, PHONE_DISPLAY } from "@/lib/brand";

type PackageResponse = {
  id: number;
  name: string;
  tag?: string | null;
  duration?: string | null;
  type?: string | null;
  description?: string | null;
  image_url?: string | null;
  includes?: string | null;
  excludes?: string | null;
  itinerary?: string | null;
  price?: number | string | null;
};

const types = [
  "All",
  "Signature Mara",
  "Amboseli Tuskers",
  "Northern Frontier",
  "Bush to Beach",
  "VIP Van Hire",
];

const fallbackPackages: PackageResponse[] = [
  {
    id: 101,
    name: "The Great Mara Migration Van Safari",
    tag: "Most Popular",
    duration: "4 Days / 3 Nights",
    type: "Signature Mara",
    price: 85000,
    image_url: "https://i.pinimg.com/1200x/ae/64/93/ae6493a432647ec3fe66e4dda779e99a.jpg",
    description:
      "Travel in executive Nganya comfort from Nairobi to the heart of the Masai Mara. Unrivalled predator tracking, panoramic pop-up roof photography, and luxury tented lodge accommodations.",
    includes:
      "Custom 4x4 executive van transport|Professional KPSGA guide|Full board luxury camp|Daily park entry fees|Bottled mineral water & onboard Wi-Fi",
    excludes:
      "Hot air balloon safari ($450 pp)|Alcoholic beverages|Driver tip & gratuity|Personal travel insurance",
    itinerary:
      "Day 1: Nairobi pickup via Great Rift Valley viewpoint to Masai Mara (Afternoon game drive)|Day 2: Full day Mara river migration & big cat tracking with picnic lunch|Day 3: Dawn sunrise game drive + cultural visit to Maasai Manyatta|Day 4: Morning savannah drive and scenic return transfer to Nairobi",
  },
  {
    id: 102,
    name: "Amboseli Super-Tuskers & Kilima Dawn",
    tag: "Executive",
    duration: "3 Days / 2 Nights",
    type: "Amboseli Tuskers",
    price: 65000,
    image_url: "https://i.pinimg.com/1200x/ce/fd/5c/cefd5ccbfc94242b15300aab408a2da0.jpg",
    description:
      "Witness Africa's largest surviving elephant families marching across observation hill against the towering backdrop of Mount Kilimanjaro.",
    includes:
      "VIP private van transport|Park conservation fees|Full board lodge stay at Ol Tukai|Experienced driver-tracker guide|Emergency flying doctor evacuation cover",
    excludes:
      "Personal safari gear|Lodge laundry services|Premium bar drinks|Optional night drives",
    itinerary:
      "Day 1: Morning Nairobi departure down Mombasa Road into Amboseli; Sunset game drive|Day 2: Full day elephant observation, swamp springs, and lake beds|Day 3: Sunrise photography session beneath Kilimanjaro and return transfer",
  },
  {
    id: 103,
    name: "Samburu & Shaba Northern Odyssey",
    tag: "Wilderness",
    duration: "5 Days / 4 Nights",
    type: "Northern Frontier",
    price: 110000,
    image_url: "https://i.pinimg.com/736x/1c/5c/6b/1c5c6be0ed2cbdadf13c8a8c6a597552.jpg",
    description:
      "Venture north of Mount Kenya across the equator into the dramatic rugged lands of Samburu. Home to the rare Samburu Special Five and authentic warrior traditions.",
    includes:
      "High-clearance executive safari van|Samburu County conservancy fees|All meals & lodge stay|Guided bush walks with local Samburu guide|Refreshments during transit",
    excludes:
      "Camel trekking fees|Souvenirs and personal purchases|Visa fees",
    itinerary:
      "Day 1: Scenic drive past Mt. Kenya into Samburu (afternoon river drive)|Day 2: Ewaso Ng'iro riverbank wildlife tracking for leopards and reticulated giraffes|Day 3: Buffalo Springs & Shaba exploration (Grevy's zebra haven)|Day 4: Cultural exchange with Samburu pastoralists & sunset cliff sundowner|Day 5: Leisurely breakfast and executive highway return to Nairobi",
  },
  {
    id: 104,
    name: "Bush to Beach: Tsavo Red Dust to Diani Sands",
    tag: "Ultimate Circuit",
    duration: "7 Days / 6 Nights",
    type: "Bush to Beach",
    price: 165000,
    image_url: "https://i.pinimg.com/1200x/0c/7e/44/0c7e446fb3bba4abe039aa1cd2d44d7e.jpg",
    description:
      "The quintessential Kenyan dual expedition. Roam among Tsavo's legendary red elephants and Mzima Springs hippo pools, then cruise directly to the turquoise Indian Ocean in Diani.",
    includes:
      "Private van with dedicated driver throughout|Tsavo West & East park passes|3 nights luxury safari camp + 3 nights 5-star beachfront resort|Dolphin dhow excursion in Wasini",
    excludes:
      "Water sports equipment hire|International airfare|Spa treatments",
    itinerary:
      "Day 1: Nairobi to Tsavo West (Mzima Springs underwater hide)|Day 2: Shetani lava flow and rhino sanctuary drives|Day 3: Transit through Tsavo East red plains to the Swahili Coast|Days 4-6: Relax in Diani Beach, marine park snorkeling, Swahili cuisine|Day 7: Private van transfer to Ukunda airstrip or Mombasa SGR terminal",
  },
  {
    id: 105,
    name: "Private VIP Nganya Van Full-Day Hire",
    tag: "Custom Hire",
    duration: "Daily Rate",
    type: "VIP Van Hire",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    description:
      "Charter our signature executive van with pop-up roof, high-fidelity sound, on-board Wi-Fi, and certified driver. Ideal for customized group safaris, corporate team retreats, or Nairobi circuit tours.",
    includes:
      "Executive van & dedicated driver|Unlimited mileage within circuit|Fuel allowance for agreed itinerary|Vehicle entrance permits|Complimentary bottled water",
    excludes:
      "Park entrance tickets for guests|Guest meals & lodging|Driver overnight allowance if outside Nairobi (KES 3,500/night)",
    itinerary:
      "Customized entirely around your group's schedule and preferred Kenyan destination.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Packages = () => {
  useSEO({
    title: "Safari Packages & VIP Van Expeditions | Jude Safaris and Adventures",
    description:
      "Explore curated Kenya safari packages: Masai Mara Great Migration, Amboseli elephant circuits, Samburu wilderness, and Tsavo to Diani Beach in executive luxury vans.",
    path: "/packages",
    keywords: [
      "Jude Safaris packages",
      "Masai Mara safari package",
      "Amboseli safari deal",
      "Kenya executive safari van hire",
      "Diani beach safari package",
    ],
  });

  const [activeType, setActiveType] = useState("All");
  const [packages, setPackages] = useState<PackageResponse[]>(fallbackPackages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/public/packages`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        }
      }
    } catch {
      // Keep rich fallback packages
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeType === "All" ? packages : packages.filter((p) => p.type === activeType);

  const buildWhatsAppInquiry = (pkgName: string) => {
    const text = `Habari Jude Safaris! I'm interested in booking the *${pkgName}* package. Please share availability and customized quote for our dates.`;
    return `https://wa.me/254742283279?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-safari-charcoal text-safari-cream pt-24">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-black to-safari-charcoal border-b border-safari-gold/15">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <p className="text-safari-gold font-bold tracking-[0.25em] uppercase text-xs mb-3">
            Handcrafted Kenyan Expeditions
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-safari-gold via-amber-200 to-safari-gold">Safari Packages</span>
          </h1>
          <p className="text-safari-sand/80 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Every package is 100% customizable. Travel in our executive pop-up roof vans with certified driver-naturalists and all-inclusive logistics.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 border-b border-safari-gold/15 bg-safari-charcoal/90 backdrop-blur-md sticky top-20 z-20">
        <div className="container mx-auto px-4 flex flex-wrap gap-2 justify-center">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeType === t
                  ? "bg-safari-gold text-safari-charcoal shadow-lg shadow-safari-gold/15"
                  : "bg-safari-warm-brown/40 text-safari-sand/80 hover:bg-safari-warm-brown hover:text-white border border-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-safari-sand/60 py-20">Loading packages...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-safari-sand/60 py-20">No packages found for this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((pkg, i) => (
                <motion.div
                  key={pkg.id || pkg.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="group bg-safari-warm-brown/30 rounded-2xl overflow-hidden border border-safari-gold/15 hover:border-safari-gold/45 hover:shadow-2xl hover:shadow-safari-gold/5 transition-all flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden bg-black/40">
                    <img
                      src={toImageSrc(pkg.image_url)}
                      alt={pkg.name}
                      onError={withImageFallback}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {pkg.tag && (
                      <span className="absolute top-4 left-4 bg-safari-gold text-safari-charcoal text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {pkg.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <h3 className="text-2xl font-display font-bold text-white group-hover:text-safari-gold transition-colors">
                        {pkg.name}
                      </h3>
                      <span className="text-xl font-display font-extrabold text-safari-gold whitespace-nowrap">
                        {typeof pkg.price === "number" ? `KES ${pkg.price.toLocaleString()}` : pkg.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-safari-sand/80 mb-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-safari-gold" />
                        {pkg.duration}
                      </span>
                      {pkg.type && (
                        <span className="bg-black/40 px-2.5 py-1 rounded border border-white/10 text-safari-sand">
                          {pkg.type}
                        </span>
                      )}
                    </div>

                    <p className="text-safari-sand/80 text-sm mb-6 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Includes & Excludes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs bg-black/30 p-4 rounded-xl border border-white/5">
                      <div>
                        <p className="font-bold text-white mb-2 flex items-center gap-1 text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> What's Included:
                        </p>
                        <ul className="space-y-1.5 text-safari-sand/70">
                          {pkg.includes?.split("|").map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold text-safari-sand/90 mb-2">Exclusions:</p>
                        <ul className="space-y-1.5 text-safari-sand/50">
                          {pkg.excludes?.split("|").map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80 shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Itinerary highlights */}
                    {pkg.itinerary && (
                      <div className="mb-6 p-4 rounded-xl bg-safari-warm-brown/20 border border-white/5">
                        <p className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">
                          Itinerary Overview:
                        </p>
                        <ul className="space-y-1.5 text-xs text-safari-sand/80">
                          {pkg.itinerary.split("|").map((day, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-safari-gold font-bold">›</span>
                              <span>{day}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                      <Link to="/booking" className="flex-1">
                        <Button className="w-full gap-2 bg-safari-gold text-safari-charcoal hover:bg-amber-400 font-extrabold rounded-xl py-5">
                          Book This Package <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <a
                        href={buildWhatsAppInquiry(pkg.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:w-auto"
                      >
                        <Button
                          variant="outline"
                          className="w-full gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40 rounded-xl py-5"
                        >
                          <Phone className="w-4 h-4" /> WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Guarantee Banner */}
      <section className="py-16 bg-black/40 border-t border-safari-gold/15">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <ShieldCheck className="w-12 h-12 text-safari-gold mx-auto mb-4" />
          <h3 className="text-2xl font-display font-bold text-white mb-2">100% Satisfaction Guarantee</h3>
          <p className="text-safari-sand/80 text-sm leading-relaxed mb-6">
            If bad weather or park circumstances disrupt your schedule, our concierge desk rearranges routes with zero administrative fees.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-safari-gold text-safari-gold hover:bg-safari-gold hover:text-safari-charcoal rounded-xl font-bold">
              Chat with Concierge ({PHONE_DISPLAY})
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Packages;