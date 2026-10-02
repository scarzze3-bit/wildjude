// Jude Safaris and Adventures - Executive Homepage
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Users, MapPin, Calendar, Compass, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";
import { useSEO } from "@/hooks/use-seo";
import { WHATSAPP_URL, PHONE_DISPLAY } from "@/lib/brand";

type PackageResponse = {
  id: number;
  name: string;
  duration?: string | null;
  price?: number | string | null;
  tag?: string | null;
  image_url?: string | null;
  description?: string | null;
};

type HomepagePackage = {
  id?: number;
  name: string;
  duration: string;
  price: string;
  tag: string;
  image: string;
  desc: string;
};

import heroImage from "@/assets/hero-safari.jpg";
import balloonImg from "@/assets/balloon-safari.jpg";
import zanzibarImg from "@/assets/zanzibar-beach.jpg";
import masaiMaraImg from "@/assets/masai-mara.jpg";

// Kenya-only iconic destinations
const iconicDestinations = [
  {
    name: "Masai Mara National Reserve",
    county: "Narok County, Kenya",
    image: "https://i.pinimg.com/1200x/ae/64/93/ae6493a432647ec3fe66e4dda779e99a.jpg",
    desc: "World-famous big cat density, the Great Migration, and panoramic savannah dawns.",
  },
  {
    name: "Amboseli National Park",
    county: "Kajiado County, Kenya",
    image: "https://i.pinimg.com/1200x/ce/fd/5c/cefd5ccbfc94242b15300aab408a2da0.jpg",
    desc: "Iconic free-ranging super-tusker elephant herds beneath Mt. Kilimanjaro's snow line.",
  },
  {
    name: "Samburu & Buffalo Springs",
    county: "Samburu County, Kenya",
    image: "https://i.pinimg.com/736x/1c/5c/6b/1c5c6be0ed2cbdadf13c8a8c6a597552.jpg",
    desc: "Arid northern paradise home to Grevy's zebras, reticulated giraffes, and Samburu culture.",
  },
  {
    name: "Tsavo East & West",
    county: "Taita-Taveta County, Kenya",
    image: "https://i.pinimg.com/736x/e9/dc/d6/e9dcd62be4f11040b9ff07ba7a54749b.jpg",
    desc: "Kenya's grandest wilderness, famous for legendary red-dust elephants and Mzima Springs.",
  },
  {
    name: "Lake Nakuru & Naivasha",
    county: "Nakuru County, Kenya",
    image: "https://i.pinimg.com/1200x/4e/fa/77/4efa77e3fc8a32a5148bb70755f2921b.jpg",
    desc: "Great Rift Valley bird sanctuaries, black and white rhino sanctuaries, and boat safaris.",
  },
  {
    name: "Diani Beach & Wasini",
    county: "Kwale County, Kenya",
    image: "https://i.pinimg.com/1200x/0c/7e/44/0c7e446fb3bba4abe039aa1cd2d44d7e.jpg",
    desc: "Award-winning white sand coastlines, dolphin safaris, coral reefs, and Swahili seafood.",
  },
];

const fallbackPackages: HomepagePackage[] = [
  {
    name: "The Great Mara Migration Van Safari",
    duration: "4 Days / 3 Nights",
    price: "From KES 85,000",
    tag: "Signature Circuit",
    image: masaiMaraImg,
    desc: "Travel in our flagship executive Nganya safari van with custom audio, 360° pop-up viewing roof, and expert tracker guides.",
  },
  {
    name: "Amboseli Giants & Kilimanjaro Dawn",
    duration: "3 Days / 2 Nights",
    price: "From KES 65,000",
    tag: "Exclusive",
    image: "https://i.pinimg.com/1200x/ce/fd/5c/cefd5ccbfc94242b15300aab408a2da0.jpg",
    desc: "Direct VIP transfers to Ol Tukai with front-row encounters with Africa's legendary tusker elephant families.",
  },
  {
    name: "Northern Frontier Samburu Expedition",
    duration: "5 Days / 4 Nights",
    price: "From KES 98,000",
    tag: "Wilderness",
    image: "https://i.pinimg.com/736x/1c/5c/6b/1c5c6be0ed2cbdadf13c8a8c6a597552.jpg",
    desc: "Venture deep into Kenya's northern wilderness to discover the Samburu Special Five and authentic warrior traditions.",
  },
  {
    name: "Bush to Coast: Tsavo to Diani Sands",
    duration: "7 Days / 6 Nights",
    price: "From KES 145,000",
    tag: "Ultimate Kenya",
    image: zanzibarImg,
    desc: "Seamless transition from red-dust big game tracking in Tsavo to pure tropical luxury on Diani's azure shores.",
  },
];

const testimonials = [
  {
    name: "David & Grace Mwangi",
    location: "Nairobi / London",
    text: "Jude Safaris and Adventures gave our family an unforgettable experience across the Mara. The executive van with surround sound and high-speed Wi-Fi turned long transit into pure luxury.",
    rating: 5,
  },
  {
    name: "Dr. Amara Osei",
    location: "Accra, Ghana",
    text: "The Amboseli elephant drive with Jude's crew was a masterclass. From dawn photography to executive van comforts, there is no other safari company in Kenya doing it with this level of soul and energy.",
    rating: 5,
  },
  {
    name: "Marco & Lucia",
    location: "Milan, Italy",
    text: "Riding through the Rift Valley in Jude's custom VIP van felt like an elite private expedition. Every detail, from the cool towels to the expert tracking, was five-star.",
    rating: 5,
  },
];

const stats = [
  { value: "100%", label: "Kenyan Owned & Guided" },
  { value: "4,800+", label: "Expeditions Completed" },
  { value: "VIP", label: "Custom Nganya Vans" },
  { value: "4.9★", label: "Client Satisfaction" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const toProxiedVideoUrl = (url: string) =>
  `${API_BASE_URL}/public/video-proxy?url=${encodeURIComponent(url)}`;

const heroMedia = [
  { type: "image", src: heroImage },
  { type: "image", src: "/images/nganya/nganya-1.png" },
  { type: "image", src: "/images/nganya/nganya-3.png" },
  { type: "video", src: toProxiedVideoUrl("https://pixabay.com/videos/download/video-114145_medium.mp4") },
  { type: "video", src: toProxiedVideoUrl("https://pixabay.com/videos/download/video-119527_medium.mp4") },
  { type: "video", src: toProxiedVideoUrl("https://pixabay.com/videos/download/video-126212_medium.mp4") },
];

const Index = () => {
  useSEO({
    title: "Jude Safaris and Adventures | Kenya Executive Safari & VIP Nganya Expeditions",
    description:
      "Handcrafted safari experiences across Kenya with custom executive luxury vans. Experience Masai Mara, Amboseli, Samburu, Tsavo, and Diani Beach with local experts.",
    path: "/",
    keywords: [
      "Jude Safaris",
      "Jude Safaris and Adventures",
      "Kenya luxury safari",
      "Nganya safari van",
      "Masai Mara safari van",
      "Amboseli safari package",
      "Nairobi safari tour",
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Jude Safaris and Adventures",
        url: window.location.origin,
      },
      {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: "Jude Safaris and Adventures",
        url: window.location.origin,
        telephone: PHONE_DISPLAY,
        areaServed: ["Kenya", "Nairobi", "Masai Mara", "Amboseli", "Samburu", "Tsavo", "Diani Beach"],
      },
    ],
  });

  const [currentImage, setCurrentImage] = useState(0);
  const [packages, setPackages] = useState<HomepagePackage[]>(fallbackPackages);
  const [failedVideoSlides, setFailedVideoSlides] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroMedia.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const markVideoFailed = (index: number) => {
    setFailedVideoSlides((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const apiUrl = API_BASE_URL;
      const pkgResponse = await fetch(`${apiUrl}/public/packages`);
      if (pkgResponse.ok) {
        const pkgData = await pkgResponse.json();
        if (Array.isArray(pkgData) && pkgData.length > 0) {
          const apiPackages = (pkgData as PackageResponse[]).slice(0, 4).map((pkg) => ({
            id: pkg.id,
            name: pkg.name,
            duration: pkg.duration || "Custom",
            price: typeof pkg.price === "number" ? `From KES ${pkg.price.toLocaleString()}` : `From ${pkg.price}`,
            tag: pkg.tag || "Signature",
            image: toImageSrc(pkg.image_url),
            desc: pkg.description || "Executive Kenyan safari experience.",
          }));
          setPackages(apiPackages);
        }
      }
    } catch (error) {
      console.warn("Using fallback Kenya packages:", error);
    }
  };

  return (
    <div className="min-h-screen bg-safari-charcoal text-safari-cream">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[720px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {heroMedia.map((media, index) =>
            media.type === "video" && !failedVideoSlides.has(index) ? (
              <video
                key={media.src}
                src={media.src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => markVideoFailed(index)}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1500ms] ease-in-out ${
                  index === currentImage
                    ? "opacity-100 scale-100"
                    : index === (currentImage - 1 + heroMedia.length) % heroMedia.length
                    ? "opacity-0 scale-110"
                    : "opacity-0 scale-95"
                }`}
              />
            ) : (
              <img
                key={`${media.src}-fallback`}
                src={media.type === "video" ? heroImage : media.src}
                alt="Jude Safaris Kenyan savannah scene"
                onError={withImageFallback}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1500ms] ease-in-out ${
                  index === currentImage
                    ? "opacity-100 scale-100"
                    : index === (currentImage - 1 + heroMedia.length) % heroMedia.length
                    ? "opacity-0 scale-110"
                    : "opacity-0 scale-95"
                }`}
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-safari-charcoal" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.25em] bg-safari-gold/15 text-safari-gold border border-safari-gold/30 mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" /> Kenya Executive Van Expeditions • VIP Nganya Culture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white tracking-tight leading-[1.08] mb-6 drop-shadow-xl"
          >
            Safari, Elevated by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-safari-gold via-amber-200 to-safari-gold">
              Kenyan Soul
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-safari-sand/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Handcrafted expeditions across Kenya's greatest wildernesses. High-spec executive vans with pop-up viewing roofs, studio acoustics, and master Kenyan tracker guides.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/booking">
              <Button size="lg" className="text-base px-8 py-6 gap-2 bg-safari-gold text-safari-charcoal hover:bg-amber-400 font-extrabold shadow-xl shadow-safari-gold/20">
                Reserve Your Van <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/destinations">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-safari-gold/40 text-safari-cream hover:bg-white/10 backdrop-blur-sm">
                Explore Kenyan Circuits
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="ghost" className="text-base px-6 py-6 text-safari-gold hover:text-white hover:bg-safari-gold/10">
                Official Merch
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-safari-cream/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-safari-cream/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-safari-warm-brown/80 border-y border-safari-gold/20 py-8 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-display font-extrabold text-safari-gold">{stat.value}</p>
                <p className="text-xs md:text-sm text-safari-sand/80 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-safari-charcoal relative">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-safari-gold font-semibold tracking-[0.25em] uppercase text-xs mb-3">
              The Jude Safaris Standard
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Executive Comfort Meets <span className="italic text-safari-gold">Savannah Majesty</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-safari-sand/80 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              We took Kenya’s world-famous Nganya vehicle craftsmanship and reimagined it into the most comfortable, tech-enabled safari cruiser on African roads.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Volume2,
                title: "Custom Acoustic & VIP Seating",
                desc: "High-density leather captain's chairs, on-board Wi-Fi, USB-C rapid charging ports, and studio-grade sound for scenic journey playlists.",
              },
              {
                icon: Compass,
                title: "Master Kenyan Field Trackers",
                desc: "Every driver-guide has deep generational roots in the Maasai Mara, Samburu, and Tsavo reserves with elite wildlife spotting abilities.",
              },
              {
                icon: Shield,
                title: "Ethical & Direct Community Impact",
                desc: "Direct support to indigenous conservancies, clean drinking water initiatives, and local artisan craft cooperatives.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-safari-warm-brown/30 rounded-2xl p-8 text-center hover:border-safari-gold/40 border border-safari-gold/15 transition-all duration-300 hover:shadow-2xl hover:shadow-safari-gold/5"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-safari-gold/15 flex items-center justify-center text-safari-gold border border-safari-gold/30">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-3">{item.title}</h3>
                <p className="text-safari-sand/70 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Authentic Nganya Fleet Showcase */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 pt-12 border-t border-safari-gold/20"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <p className="text-safari-gold font-semibold tracking-[0.25em] uppercase text-xs mb-2">
                  Live The Nganya Culture
                </p>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                  Our Custom <span className="italic text-safari-gold">Safari Cruiser Fleet</span>
                </h3>
              </div>
              <Link to="/about" className="text-safari-gold text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-3 md:mt-0">
                Explore The Van Craftsmanship <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  src: "/images/nganya/nganya-1.png",
                  title: "Flagship Nganya Van",
                  subtitle: "Custom Stance & Trail Alloys",
                  tag: "Flagship Cruiser",
                },
                {
                  src: "/images/nganya/nganya-2.png",
                  title: "VIP Executive Cabin",
                  subtitle: "Reclining Captain Chairs with Armrests",
                  tag: "VIP Interior",
                },
                {
                  src: "/images/nganya/nganya-3.png",
                  title: "High-Roof Safari Beast",
                  subtitle: "Custom Grille & Precision LED Array",
                  tag: "Custom Spec",
                },
              ].map((fleet, idx) => (
                <motion.div
                  key={fleet.title}
                  variants={fadeUp}
                  custom={idx}
                  className="group relative rounded-2xl overflow-hidden border border-safari-gold/25 bg-safari-warm-brown/40 shadow-xl"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={fleet.src}
                      alt={fleet.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 bg-safari-gold/90 text-safari-charcoal text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                      {fleet.tag}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-display font-bold text-lg text-white group-hover:text-safari-gold transition-colors">
                      {fleet.title}
                    </h4>
                    <p className="text-safari-sand/70 text-xs mt-1">
                      {fleet.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Kenya Destinations */}
      <section className="py-24 bg-black/40 border-t border-safari-gold/15">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-safari-gold font-semibold tracking-[0.25em] uppercase text-xs mb-3">
                Premier Wilderness Circuits
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-white">
                Iconic <span className="italic text-safari-gold">Kenyan Lands</span>
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/destinations" className="text-safari-gold font-semibold flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0 text-sm">
                View All Kenyan Circuits <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {iconicDestinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Link to="/destinations" className="group block relative rounded-2xl overflow-hidden aspect-[4/3] border border-safari-gold/15 hover:border-safari-gold/40 transition-all">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    onError={withImageFallback}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-safari-gold text-xs font-semibold uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.county}
                    </div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-safari-gold transition-colors">{dest.name}</h3>
                    <p className="text-safari-sand/80 text-xs mt-1.5 line-clamp-2 leading-relaxed">{dest.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safari Packages */}
      <section className="py-24 bg-safari-charcoal border-t border-safari-gold/15">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-safari-gold font-semibold tracking-[0.25em] uppercase text-xs mb-3">
              Tailored Itineraries
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Curated <span className="italic text-safari-gold">Van Expeditions</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-safari-sand/80 max-w-2xl mx-auto text-base leading-relaxed">
              Every expedition includes private executive van transport, experienced naturalist guide, park conservation fees, and hand-selected luxury lodges.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id || pkg.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group bg-safari-warm-brown/30 rounded-2xl overflow-hidden border border-safari-gold/15 hover:border-safari-gold/45 hover:shadow-2xl hover:shadow-safari-gold/5 transition-all flex flex-col"
              >
                <div className="relative h-60 overflow-hidden bg-black/40">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    onError={withImageFallback}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-safari-gold text-safari-charcoal text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {pkg.tag}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-safari-gold transition-colors">{pkg.name}</h3>
                    <span className="text-safari-gold font-display font-bold text-lg whitespace-nowrap">{pkg.price}</span>
                  </div>
                  <p className="text-safari-sand/70 text-sm mb-6 leading-relaxed flex-1">{pkg.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-safari-sand/70 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-safari-gold" />
                      {pkg.duration}
                    </span>
                    <Link to="/booking">
                      <Button size="sm" className="gap-1.5 bg-safari-gold text-safari-charcoal hover:bg-amber-400 font-bold rounded-xl">
                        Book Van <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="gap-2 border-safari-gold/40 text-safari-cream hover:bg-safari-gold hover:text-safari-charcoal font-bold rounded-xl px-8">
                View All Packages <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black/50 border-t border-safari-gold/15">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-safari-gold font-semibold tracking-[0.25em] uppercase text-xs mb-3">
              Guest Testimonials
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Voices from the <span className="italic text-safari-gold">Trail</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-safari-warm-brown/30 rounded-2xl p-8 border border-safari-gold/15 hover:border-safari-gold/30 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-safari-gold text-safari-gold" />
                  ))}
                </div>
                <p className="text-safari-sand/90 leading-relaxed mb-6 italic text-sm">"{t.text}"</p>
                <div>
                  <p className="font-display font-bold text-white">{t.name}</p>
                  <p className="text-xs text-safari-sand/60">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative py-28 overflow-hidden border-t border-safari-gold/20">
        <div className="absolute inset-0">
          <img src={balloonImg} alt="Masai Mara Dawn" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-safari-gold font-bold mb-4">
              Ready for Your Kenyan Expedition?
            </span>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
              Let's Hit the Savannah in <span className="italic text-safari-gold">Executive Style</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-safari-sand/90 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
              Our executive Nganya vans are serviced, polished, and ready. Contact our Nairobi concierge desk for bespoke circuit planning.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button size="lg" className="text-base px-8 py-6 gap-2 bg-safari-gold text-safari-charcoal hover:bg-amber-400 font-extrabold rounded-xl shadow-xl shadow-safari-gold/20">
                  Book Your Van <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 border-emerald-500/50 text-emerald-400 bg-emerald-950/40 hover:bg-emerald-600 hover:text-white rounded-xl backdrop-blur-sm transition-all">
                  Chat on WhatsApp ({PHONE_DISPLAY})
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;