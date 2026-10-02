// Jude Safaris and Adventures - Contact Page
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { useSEO } from "@/hooks/use-seo";
import { BRAND, WHATSAPP_URL } from "@/lib/brand";

type ContactInfo = { phone?: string; email?: string; whatsapp?: string; address?: string; office_hours?: string; };

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", destination: "", travelers: "", message: "" });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});

  useSEO({
    title: "Contact Jude Safaris | Book Your Kenya Safari from Kabarnet, Baringo",
    description: "Reach Jude Safaris and Adventures based in Kabarnet, Baringo. Book premium Kenya safari circuits.",
    keywords: "contact Jude Safaris, Kenya safari booking, Kabarnet Baringo",
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/public/contact-info`)
      .then((r) => r.json())
      .then((d) => setContactInfo(d))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, email: formData.email, phone: formData.phone,
          subject: `Safari Inquiry - ${formData.destination || "General"}`,
          message: `Destination: ${formData.destination}\nTravelers: ${formData.travelers}\n\n${formData.message}`,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${response.status}`);
      }
      toast({ title: "Inquiry Sent!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", phone: "", destination: "", travelers: "", message: "" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send inquiry. Please try again.", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const phone = contactInfo.phone || BRAND.phone;
  const email = contactInfo.email || BRAND.email;
  const address = contactInfo.address || "Kabarnet Town, Baringo County, Kenya";

  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Plan Your <span className="italic text-primary">Safari</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ready to explore Kenya? Fill out the form below or reach us directly in Kabarnet, Baringo. We respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 order-1 lg:order-2">
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border space-y-6">
                <h3 className="font-display text-2xl font-semibold mb-2">Booking Inquiry</h3>
                <p className="text-muted-foreground text-sm mb-6">Tell us about your dream Kenya safari and we'll create a custom itinerary.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+254 700 000 000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Number of Travelers</label>
                    <Input name="travelers" value={formData.travelers} onChange={handleChange} placeholder="e.g. 2 adults, 1 child" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Preferred Destination</label>
                  <select name="destination" value={formData.destination} onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Select a Kenya destination</option>
                    <option>Masai Mara, Narok</option>
                    <option>Amboseli National Park</option>
                    <option>Tsavo East and West</option>
                    <option>Lake Bogoria, Baringo</option>
                    <option>Lake Nakuru National Park</option>
                    <option>Samburu National Reserve</option>
                    <option>Aberdare National Park</option>
                    <option>Mount Kenya Circuit</option>
                    <option>Ol Pejeta Conservancy</option>
                    <option>Diani Beach, Mombasa Coast</option>
                    <option>Custom / Multiple Kenya Destinations</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Tell Us About Your Dream Safari</label>
                  <Textarea name="message" value={formData.message} onChange={handleChange}
                    placeholder="Dates, interests, budget range, special requests..." rows={5} />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </Button>
              </motion.form>
            </div>

            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h3 className="font-display text-xl font-semibold mb-6">Reach Us Directly</h3>
                <div className="space-y-6">
                  {[
                    { icon: Phone, label: "Call Us", value: phone, href: `tel:${phone.replace(/[^0-9+]/g, "")}` },
                    { icon: Mail, label: "Email Us", value: email, href: `mailto:${email}` },
                    { icon: MessageCircle, label: "WhatsApp", value: BRAND.phone, href: WHATSAPP_URL },
                    { icon: MapPin, label: "Visit Us", value: address, href: "#" },
                  ].map((item) => (
                    <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer" className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-display font-semibold mb-2">Office Hours</h4>
                {contactInfo.office_hours ? (
                  <div className="text-sm text-muted-foreground whitespace-pre-line">{contactInfo.office_hours}</div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Mon - Fri: 7:00 AM - 7:00 PM (EAT)</p>
                    <p className="text-sm text-muted-foreground">Sat: 8:00 AM - 4:00 PM (EAT)</p>
                    <p className="text-sm text-muted-foreground">Sun: 9:00 AM - 1:00 PM (EAT)</p>
                  </>
                )}
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-safari-gold" /> Our Location
                </h4>
                <div className="rounded-lg overflow-hidden h-44">
                  <iframe
                    title="Jude Safaris Location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=35.78%2C0.45%2C35.82%2C0.51&layer=mapnik&marker=0.488%2C35.803"
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Kabarnet Town, Baringo County, Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
