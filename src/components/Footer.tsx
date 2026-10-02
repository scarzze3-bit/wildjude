import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Music2 } from "lucide-react";
import { BRAND, WHATSAPP_URL, SOCIAL_LINKS } from "@/lib/brand";

const partners = [
  { name: "KWS", logo: "https://www.kws.go.ke/sites/default/files/logo_2.png" },
  { name: "TOSK", logo: "https://staging.toskenya.org/wp-content/uploads/2024/03/tosk_logo_v2.webp" },
  { name: "Magical Kenya", logo: "https://i.pinimg.com/736x/58/91/7f/58917f27ff0f4b5315f9388877d62bd0.jpg" },
  { name: "Sopa Lodges", logo: "https://www.sopalodges.com/images/logos/sopalodges-logo.png" },
  { name: "Serena Hotels", logo: "https://image-tc.galaxy.tf/wisvg-2kxzoagrzpaii22pmbq9rz11m/serena-hotel-logo.svg?width=128&height=80" },
  { name: "TripAdvisor", logo: "https://static.tacdn.com/img2/brand_refresh_2025/logos/wordmark.svg" },
  { name: "Jambojet", logo: "https://www.flightscanner.co.ke/wp-content/uploads/2016/12/Jambojet-logo-wide.png" },
  { name: "SGR", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUfUOg0O776XzR-tL21xaFeLSh4JN6acs5ng&s" },
];

const quickLinks = [
  { label: "Destinations", path: "/destinations" },
  { label: "Safari Packages", path: "/packages" },
  { label: "Safari Shop", path: "/shop" },
  { label: "About Jude Safaris", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
  { label: "Book a Safari", path: "/booking" },
];

const kenyanDestinations = [
  "Lake Victoria",
  "Homa Bay",
  "Baringo County",
  "Coastal Circuit",
  "Northern Frontier",
];

const socialLinks = [
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
  { icon: Music2, href: SOCIAL_LINKS.tiktok, label: "TikTok" },
];

const Footer = () => (
  <footer className="bg-safari-charcoal text-safari-sand">
    {/* Partners Scroll */}
    <div className="border-b border-safari-warm-brown/30 py-10 overflow-hidden">
      <div className="container mx-auto px-4 mb-7">
        <p className="text-center label-safari opacity-60">Trusted Partners</p>
      </div>
      <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] py-2">
        <div className="flex w-max animate-scroll" style={{ animationDuration: "45s" }}>
          {[...partners, ...partners].map((p, i) => (
            <div key={i} className="flex-shrink-0 w-[200px] md:w-[240px] px-4 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-center w-full h-[80px] hover:shadow-[0_0_16px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-1">
                <img src={p.logo} alt={p.name} title={p.name} className="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Main Footer */}
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div>
          <h3 className="text-2xl font-display font-bold text-safari-cream mb-1">
            Jude <span className="text-safari-gold">Safaris</span>
          </h3>
          <p className="text-xs tracking-[0.18em] uppercase text-safari-gold/70 mb-5">&amp; Adventures</p>
          <p className="text-sm leading-relaxed opacity-75 mb-3 italic font-display">
            "{BRAND.tagline}"
          </p>
          <p className="text-sm leading-relaxed opacity-65 mb-6">
            Premium Kenyan expeditions in custom luxury safari vans.
            From Western highlands to the Northern Frontier — we drive the wild.
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-full bg-safari-warm-brown/60 hover:bg-safari-gold hover:text-safari-charcoal text-safari-sand transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold text-safari-cream mb-5">Navigate</h4>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="opacity-70 hover:opacity-100 hover:text-safari-gold transition-all flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-3 h-px bg-safari-gold transition-all duration-200 overflow-hidden" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kenyan Destinations */}
        <div>
          <h4 className="font-display font-semibold text-safari-cream mb-5">Kenyan Circuits</h4>
          <ul className="space-y-3 text-sm">
            {kenyanDestinations.map((item) => (
              <li key={item}>
                <Link to="/destinations" className="opacity-70 hover:opacity-100 hover:text-safari-gold transition-all flex items-center gap-2 group">
                  <MapPin className="w-3 h-3 text-safari-gold/60 group-hover:text-safari-gold flex-shrink-0" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold text-safari-cream mb-5">Get in Touch</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a href={"tel:" + BRAND.phone} className="flex items-center gap-3 opacity-75 hover:opacity-100 hover:text-safari-gold transition-all">
                <Phone className="w-4 h-4 text-safari-gold flex-shrink-0" />
                {BRAND.phone}
              </a>
            </li>
            <li>
              <a href={"mailto:" + BRAND.email} className="flex items-center gap-3 opacity-75 hover:opacity-100 hover:text-safari-gold transition-all break-all">
                <Mail className="w-4 h-4 text-safari-gold flex-shrink-0" />
                {BRAND.email}
              </a>
            </li>
            <li className="flex items-start gap-3 opacity-75">
              <MapPin className="w-4 h-4 text-safari-gold mt-0.5 flex-shrink-0" />
              {BRAND.location}
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1fba58] text-white text-xs font-semibold transition-all mt-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Us Now
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-safari-warm-brown/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-50">
        <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <p>{BRAND.license}</p>
      </div>
    </div>
  </footer>
);

export default Footer;
