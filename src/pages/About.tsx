// Jude Safaris and Adventures - About Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Globe, Leaf, Users, Star, MapPin, Shield } from "lucide-react";
import heroImage from "@/assets/hero-safari.jpg";
import { useSEO } from "@/hooks/use-seo";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";
import { BRAND } from "@/lib/brand";

const NGANYA_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=900&q=85&fit=crop", alt: "Safari convoy Masai Mara", caption: "The Nganya in its element - Masai Mara at dusk" },
  { src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=85&fit=crop", alt: "Luxury safari vehicle", caption: "Executive cabin - leather, legroom, live power" },
  { src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=85&fit=crop", alt: "Elephants Amboseli", caption: "Amboseli Giants - front-row seats, zero compromise" },
  { src: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=900&q=85&fit=crop", alt: "Kenya savanna sunrise", caption: "Baringo skies - where the Rift Valley breathes" },
];

const GALLERY_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80&fit=crop", alt: "Elephant herds Amboseli" },
  { src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80&fit=crop", alt: "Safari interior luxury" },
  { src: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80&fit=crop", alt: "Kenya sunrise Rift Valley" },
  { src: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80&fit=crop", alt: "Safari vehicles Mara" },
  { src: "https://images.unsplash.com/photo-1568010434370-80d3c8c64a73?w=600&q=80&fit=crop", alt: "Masai Mara wildebeest" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80&fit=crop", alt: "Kenya wildlife lions" },
];

const values = [
  { icon: Heart, title: "Nganya Soul", desc: "Every van carries the spirit of Kenya's iconic Matatu culture - elevated to executive luxury." },
  { icon: Globe, title: "Kenya First", desc: "100% locally rooted. We invest in Baringo, Rift Valley, and Mara communities every single trip." },
  { icon: Leaf, title: "Eco-Responsible", desc: "Low-impact travel, conservation funding, and wildlife stewardship baked into every itinerary." },
  { icon: Shield, title: "KATO Certified", desc: "Fully licensed with the Kenya Association of Tour Operators. Your safety and trust are non-negotiable." },
  { icon: Star, title: "VIP Experience", desc: "Small group sizes, bespoke itineraries, and personal guide service from Kabarnet to the Mara." },
  { icon: Users, title: "Local Guides", desc: "Our guides are from the land - Kalenjin elders, Samburu scouts, Maasai rangers. Authenticity guaranteed." },
];

const WINNY_IMAGE_URL = "https://www.dropbox.com/scl/fi/akrr9k0y2emttcg8l4czv/cheptanui.jpeg?rlkey=9xyqhllb49d9qun02afqi0yy7&st=s0125bmd&dl=0";
const WINNY_DIRECTOR_BIO =
  "As Director of Jude Safaris and Adventures, Winny leads the company with a bold vision for premium, Kenya-authentic safari experiences. Raised in the Great Rift Valley, she brings deep field expertise across Masai Mara, Amboseli, Lake Bogoria, and Baringo - ensuring every journey reflects the heart of Kenya's landscapes. Her leadership blends uncompromising service quality with genuine community impact and a passion for conservation.";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

type TeamMember = { name: string; role: string; bio: string; image_url?: string | null; };

const defaultTeamMembers: TeamMember[] = [
  { name: "Winny Bitok", role: "Director", bio: WINNY_DIRECTOR_BIO, image_url: WINNY_IMAGE_URL },
  { name: "Andre Silva", role: "Logistics Coordinator", bio: "Andre oversees operations at Jude Safaris, ensuring every journey from Kabarnet to the Mara runs seamlessly. From vehicle scheduling and lodge confirmations to route planning and on-ground support, he manages the details that make each safari effortless." },
  { name: "Eliud Rotich", role: "Travel Consultant", bio: "Eliud designs personalized safari experiences across Kenya - from the flamingo shores of Lake Bogoria to the golden plains of the Masai Mara. His commitment to excellence makes every Jude Safaris journey smooth, memorable, and stress-free." },
];

const About = () => {
  const [aboutSection, setAboutSection] = useState<"story" | "team">("story");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [activePhoto, setActivePhoto] = useState(0);

  useSEO({
    title: "About Jude Safaris and Adventures | Our Story",
    description: "Premium Kenya safari experiences rooted in Nganya culture - based in Kabarnet, Baringo.",
    keywords: "Jude Safaris, Kenya safari, Kabarnet, Baringo, Nganya, KATO certified",
  });

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/team`);
        if (!res.ok) return;
        const data = await res.json();
        const members = Array.isArray(data) ? data : (data.team ?? data.members ?? []);
        const normalized: TeamMember[] = members
          .filter((m: unknown) => m && typeof m === "object")
          .map((member: Record<string, unknown>) => {
            const isWinny = String(member.name || "").toLowerCase().includes("winny");
            return {
              name: String(member.name || ""),
              role: String(member.role || ""),
              bio: String(member.bio || (isWinny ? WINNY_DIRECTOR_BIO : "")),
              image_url: member.image_url || (isWinny ? WINNY_IMAGE_URL : null),
            };
          });
        if (normalized.length > 0) setTeamMembers(normalized);
      } catch (e) { console.error("Team load failed", e); }
    };
    loadTeam();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActivePhoto((p) => (p + 1) % NGANYA_PHOTOS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-sm">
            <p className="text-sm font-medium text-foreground mb-3">About Us</p>
            <div className="grid grid-cols-2 gap-3">
              {(["story", "team"] as const).map((sec) => (
                <button key={sec} type="button" onClick={() => setAboutSection(sec)}
                  className={`w-full rounded-md border px-4 py-2 text-center text-sm transition-colors ${
                    aboutSection === sec ? "border-primary bg-primary/10 text-primary" : "border-input bg-background text-foreground hover:bg-muted"
                  }`}>
                  {sec === "story" ? "Our Story" : "Our Team"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {aboutSection === "story" ? (
        <>
          <section className="relative py-28 overflow-hidden">
            <div className="absolute inset-0">
              <img src={heroImage} alt="Kenyan safari landscape" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-safari-charcoal/75" />
            </div>
            <div className="relative z-10 container mx-auto px-4 text-center">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                className="text-safari-gold font-medium tracking-[0.2em] uppercase text-sm mb-3">
                Rooted in Kenya
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-display font-bold text-safari-cream mb-6">
                Born from the <span className="italic text-safari-gold">Rift Valley</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="text-safari-sand/90 max-w-2xl mx-auto text-lg leading-relaxed">
                Founded in Kabarnet, Baringo - the heartland of Kenya's Great Rift Valley - Jude Safaris and Adventures
                was built on a simple belief: the most powerful safaris feel genuinely Kenyan, from the Nganya vans to
                the guides who know these lands by name.
              </motion.p>
            </div>
          </section>

          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <motion.p variants={fadeUp} custom={0} className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Mission</motion.p>
                  <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                    The Nganya <span className="italic text-primary">Elevated</span>
                  </motion.h2>
                  <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-4">
                    We took Kenya's most iconic transport culture - the Matatu Nganya - and elevated it to an executive
                    safari experience. Custom luxury vans, leather interiors, onboard WiFi, and panoramic roofs, guided
                    by locals who have lived every circuit we run.
                  </motion.p>
                  <motion.p variants={fadeUp} custom={3} className="text-muted-foreground leading-relaxed mb-4">
                    Every booking directly funds community development in Baringo County, Lake Bogoria conservation,
                    and wildlife corridors from the Mara to Amboseli.
                  </motion.p>
                  <motion.div variants={fadeUp} custom={4} className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-safari-gold shrink-0" />
                    <span className="text-sm font-medium text-safari-gold">{BRAND.location} · {BRAND.license}</span>
                  </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.8 }}
                  className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl">
                  {NGANYA_PHOTOS.map((photo, i) => (
                    <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === activePhoto ? "opacity-100" : "opacity-0"}`}>
                      <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-safari-charcoal/80 via-transparent to-transparent" />
                      <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium tracking-wide">{photo.caption}</p>
                    </div>
                  ))}
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    {NGANYA_PHOTOS.map((_, i) => (
                      <button key={i} onClick={() => setActivePhoto(i)} aria-label={`Photo ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${i === activePhoto ? "bg-safari-gold w-5" : "bg-white/50 w-2"}`} />
                    ))}
                  </div>
                  <div className="absolute top-4 left-4 bg-safari-gold text-safari-charcoal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Nganya Vibes
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-12 bg-safari-charcoal">
            <div className="container mx-auto px-4 mb-8 text-center">
              <p className="text-safari-gold font-medium tracking-[0.2em] uppercase text-sm mb-2">The Jude Safaris Experience</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-safari-cream">
                Where <span className="italic text-safari-gold">Nganya Culture</span> Meets Executive Safari
              </h2>
            </div>
            <div className="flex gap-4 px-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" as const }}>
              {GALLERY_PHOTOS.map((img, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="shrink-0 w-64 h-40 rounded-xl overflow-hidden snap-start relative group cursor-pointer">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-safari-gold/0 group-hover:bg-safari-gold/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Values</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">What Drives Us</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {values.map((v, i) => (
                  <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} custom={i}
                    className="bg-card rounded-xl p-6 border border-border hover:border-safari-gold/40 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <v.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold mb-2 text-foreground">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Team</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Meet Our Team</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">The Kenyan hearts behind every unforgettable safari experience.</p>
            </div>
            <div className="space-y-10">
              {teamMembers.map((member, i) => (
                <motion.article key={member.name} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i} className="pb-10 border-b border-border last:border-b-0">
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start">
                    <div className="mx-0 text-left">
                      <img src={toImageSrc(member.image_url)} alt={member.name} onError={withImageFallback}
                        className="w-full max-w-none md:w-56 h-96 md:h-64 object-cover rounded-md border border-border" />
                      <h2 className="text-xl font-display font-semibold text-foreground mt-4">{member.name}</h2>
                      <p className="text-primary font-medium">{member.role}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground leading-relaxed text-lg">{member.bio}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
