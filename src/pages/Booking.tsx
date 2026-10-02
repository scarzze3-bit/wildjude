import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, CalendarDays, Phone, CreditCard, Check, ChevronRight, ChevronLeft, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/use-seo";
import { KENYA_CIRCUITS } from "@/features/destinations/data";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { BRAND, WHATSAPP_URL } from "@/lib/brand";

type Step = 1 | 2 | 3 | 4 | 5;

interface BookingState {
  destinationId: string;
  startDate: string;
  endDate: string;
  groupSize: number;
  charterType: "private" | "shared";
  selectedSeats: string[];
  addOns: string[];
  customerName: string;
  phone: string;
  email: string;
  paymentMethod: "mpesa" | "card" | "bank";
  specialRequests: string;
}

const STEP_CONFIG = [
  { step: 1 as Step, label: "Destination", icon: MapPin },
  { step: 2 as Step, label: "Your Van", icon: Armchair },
  { step: 3 as Step, label: "Group", icon: Users },
  { step: 4 as Step, label: "Contact", icon: Phone },
  { step: 5 as Step, label: "Confirm", icon: CreditCard },
];

const ADD_ONS = [
  { id: "guide", label: "Expert Cultural Guide", price: 3500 },
  { id: "photography", label: "Safari Photography Session", price: 5000 },
  { id: "camping", label: "Wilderness Camping Night", price: 8000 },
  { id: "boat", label: "Lake Boat Excursion", price: 4500 },
  { id: "meal-pack", label: "Gourmet Bush Picnic Pack", price: 2500 },
];

// Interactive seat map - 7-seat luxury Nganya layout
const SEAT_LAYOUT = [
  { id: "driver", label: "Driver", row: 0, col: 0, isDriver: true },
  { id: "s1", label: "1", row: 1, col: 0 },
  { id: "s2", label: "2", row: 1, col: 2 },
  { id: "s3", label: "3", row: 2, col: 0 },
  { id: "s4", label: "4", row: 2, col: 1 },
  { id: "s5", label: "5", row: 2, col: 2 },
  { id: "s6", label: "6", row: 3, col: 0 },
  { id: "s7", label: "7", row: 3, col: 1 },
  { id: "s8", label: "8", row: 3, col: 2 },
  { id: "s9", label: "9", row: 4, col: 0 },
  { id: "s10", label: "10", row: 4, col: 1 },
  { id: "s11", label: "11", row: 4, col: 2 },
];

const calculateQuote = (state: BookingState): number => {
  const dest = KENYA_CIRCUITS.find((d) => d.id === state.destinationId);
  if (!dest) return 0;
  const basePrice = dest.priceFrom;
  const groupMultiplier = state.charterType === "private" ? 1 : Math.max(1, state.groupSize * 0.7);
  const addOnTotal = state.addOns.reduce((sum, id) => {
    const ao = ADD_ONS.find((a) => a.id === id);
    return sum + (ao?.price || 0);
  }, 0);
  return basePrice * groupMultiplier + addOnTotal;
};

const Booking = () => {
  useSEO({
    title: "Book a Safari | Jude Safaris & Adventures",
    description: "Reserve your premium Kenyan safari with Jude Safaris. Interactive booking wizard with M-Pesa and card payment.",
    path: "/booking",
    keywords: ["book Kenya safari", "M-Pesa safari booking", "Jude Safaris reservation"],
  });

  const { toast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const [state, setState] = useState<BookingState>({
    destinationId: "",
    startDate: "",
    endDate: "",
    groupSize: 2,
    charterType: "private",
    selectedSeats: [],
    addOns: [],
    customerName: "",
    phone: "",
    email: "",
    paymentMethod: "mpesa",
    specialRequests: "",
  });

  const update = (patch: Partial<BookingState>) => setState((s) => ({ ...s, ...patch }));
  const quote = calculateQuote(state);
  const dest = KENYA_CIRCUITS.find((d) => d.id === state.destinationId);

  const toggleSeat = (id: string) => {
    setState((s) => ({
      ...s,
      selectedSeats: s.selectedSeats.includes(id)
        ? s.selectedSeats.filter((s) => s !== id)
        : [...s.selectedSeats, id],
    }));
  };

  const toggleAddOn = (id: string) => {
    setState((s) => ({
      ...s,
      addOns: s.addOns.includes(id) ? s.addOns.filter((a) => a !== id) : [...s.addOns, id],
    }));
  };

  const canProceed = () => {
    if (step === 1) return !!state.destinationId && !!state.startDate;
    if (step === 3) return state.groupSize >= 1;
    if (step === 4) return !!state.customerName && !!state.phone;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/public/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: state.customerName,
          email: state.email,
          phone: state.phone,
          safari_type: dest?.name || state.destinationId,
          number_of_people: state.groupSize,
          start_date: state.startDate,
          total_price: quote,
          special_requests: [
            state.specialRequests,
            `Charter: ${state.charterType}`,
            state.addOns.length ? "Add-ons: " + state.addOns.join(", ") : "",
            `Payment: ${state.paymentMethod}`,
          ].filter(Boolean).join(" | "),
        }),
      });

      if (!res.ok) throw new Error("Booking failed");
      const data = await res.json();
      setBookingRef(data.id ? `JDE-${String(data.id).padStart(5, "0")}` : `JDE-${Date.now()}`);
      setStep(5);
      toast({ title: "Booking Submitted!", description: "We will contact you shortly to confirm." });
    } catch {
      toast({ title: "Booking Error", description: "Something went wrong. Please try WhatsApp.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-safari-obsidian pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="label-safari mb-3">Reserve Your Expedition</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-safari-cream">
            Book Your <span className="italic text-gradient-gold">Safari</span>
          </h1>
          <p className="text-safari-sand/70 mt-3 max-w-xl mx-auto">
            Five steps to your Kenyan adventure. Our team confirms within 2 hours.
          </p>
        </div>

        {/* Step Indicators */}
        {step < 5 && (
          <div className="flex items-center justify-center gap-0 mb-10">
            {STEP_CONFIG.map(({ step: s, label, icon: Icon }, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`step-indicator ${step === s ? "active" : step > s ? "completed" : "pending"}`}>
                    {step > s ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-medium hidden md:block transition-colors ${step === s ? "text-safari-gold" : step > s ? "text-safari-emerald" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
                {i < STEP_CONFIG.length - 1 && (
                  <div className={`h-px w-8 md:w-14 mx-1 transition-colors ${step > s ? "bg-safari-emerald" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="glass-dark rounded-2xl p-8 border border-safari-warm-brown/40"
          >
            {/* STEP 1: Destination */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-display font-bold text-safari-cream mb-6">Choose Your Destination</h2>
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {KENYA_CIRCUITS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => update({ destinationId: d.id })}
                      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                        state.destinationId === d.id
                          ? "border-safari-gold bg-safari-gold/10 shadow-lg shadow-safari-gold/10"
                          : "border-safari-warm-brown/40 hover:border-safari-gold/40 hover:bg-safari-stone/30"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${state.destinationId === d.id ? "border-safari-gold bg-safari-gold" : "border-muted-foreground"}`}>
                        {state.destinationId === d.id && <Check className="w-3 h-3 text-safari-charcoal" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display font-semibold text-safari-cream">{d.name}</span>
                          <span className="text-safari-gold font-price font-bold text-sm flex-shrink-0">
                            KES {d.priceFrom.toLocaleString()}+
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-safari-sand/60 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{d.county}
                          </span>
                          <span className="text-safari-sand/60 text-xs">{d.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {state.destinationId && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs text-safari-sand/70 font-medium mb-2 block uppercase tracking-widest">Departure Date</label>
                      <Input
                        type="date"
                        value={state.startDate}
                        onChange={(e) => update({ startDate: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-safari-stone/30 border-safari-warm-brown/40 text-safari-cream"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-safari-sand/70 font-medium mb-2 block uppercase tracking-widest">Return Date (optional)</label>
                      <Input
                        type="date"
                        value={state.endDate}
                        onChange={(e) => update({ endDate: e.target.value })}
                        min={state.startDate || new Date().toISOString().split("T")[0]}
                        className="bg-safari-stone/30 border-safari-warm-brown/40 text-safari-cream"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Seat Map */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-display font-bold text-safari-cream mb-2">Configure Your Van</h2>
                <p className="text-safari-sand/60 text-sm mb-6">Select your seats in the luxury Nganya safari van.</p>

                {/* Charter type */}
                <div className="flex gap-3 mb-8">
                  {(["private", "shared"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => update({ charterType: type })}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition-all ${
                        state.charterType === type ? "border-safari-gold bg-safari-gold/15 text-safari-gold" : "border-safari-warm-brown/40 text-safari-sand/70 hover:border-safari-gold/30"
                      }`}
                    >
                      {type === "private" ? "Private Charter" : "Shared Van"}
                      {type === "private" && <span className="ml-2 text-[10px] bg-safari-gold text-safari-charcoal px-1.5 py-0.5 rounded-full">Full Van</span>}
                    </button>
                  ))}
                </div>

                {/* SVG Seat Map */}
                <div className="relative mx-auto max-w-xs">
                  <div className="van-ambient-warm rounded-2xl p-6 border border-safari-warm-brown/30">
                    <p className="text-[10px] text-safari-sand/40 uppercase tracking-widest text-center mb-4">Front</p>
                    <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 0.5fr 1fr" }}>
                      {SEAT_LAYOUT.map((seat) => (
                        <div
                          key={seat.id}
                          style={{ gridRow: seat.row + 1, gridColumn: seat.col + 1 }}
                        >
                          {seat.isDriver ? (
                            <div className="w-10 h-10 rounded-lg bg-safari-warm-brown/40 flex items-center justify-center text-safari-sand/40 text-xs font-bold border border-safari-warm-brown/20">
                              DRV
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleSeat(seat.id)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 border ${
                                state.selectedSeats.includes(seat.id)
                                  ? "bg-safari-gold border-safari-gold text-safari-charcoal shadow-lg shadow-safari-gold/30"
                                  : "bg-safari-stone/60 border-safari-warm-brown/40 text-safari-sand/60 hover:border-safari-gold/50 hover:bg-safari-stone"
                              }`}
                              aria-label={"Seat " + seat.label}
                            >
                              {seat.label}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-safari-sand/40 uppercase tracking-widest text-center mt-4">Rear</p>
                  </div>
                  <div className="flex items-center gap-4 justify-center mt-4 text-xs text-safari-sand/60">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-safari-gold inline-block" /> Selected</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-safari-stone/60 border border-safari-warm-brown/40 inline-block" /> Available</span>
                  </div>
                </div>

                {state.selectedSeats.length > 0 && (
                  <p className="text-center text-safari-gold text-sm font-semibold mt-4">
                    {state.selectedSeats.length} seat{state.selectedSeats.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}

            {/* STEP 3: Group & Add-ons */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-display font-bold text-safari-cream mb-6">Group Size & Extras</h2>
                <div className="mb-8">
                  <label className="text-xs text-safari-sand/70 font-medium mb-3 block uppercase tracking-widest">Number of Travellers</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => update({ groupSize: Math.max(1, state.groupSize - 1) })}
                      className="w-10 h-10 rounded-full border border-safari-warm-brown/40 flex items-center justify-center text-safari-cream hover:border-safari-gold hover:text-safari-gold transition-all text-xl font-bold">
                      −
                    </button>
                    <span className="text-3xl font-price font-bold text-safari-gold min-w-[3ch] text-center">{state.groupSize}</span>
                    <button onClick={() => update({ groupSize: Math.min(11, state.groupSize + 1) })}
                      className="w-10 h-10 rounded-full border border-safari-warm-brown/40 flex items-center justify-center text-safari-cream hover:border-safari-gold hover:text-safari-gold transition-all text-xl font-bold">
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-safari-sand/70 font-medium mb-3 block uppercase tracking-widest">Optional Add-ons</label>
                  <div className="space-y-2">
                    {ADD_ONS.map((ao) => (
                      <button
                        key={ao.id}
                        onClick={() => toggleAddOn(ao.id)}
                        className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all ${
                          state.addOns.includes(ao.id) ? "border-safari-emerald bg-safari-emerald/10" : "border-safari-warm-brown/30 hover:border-safari-gold/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${state.addOns.includes(ao.id) ? "border-safari-emerald bg-safari-emerald" : "border-muted-foreground"}`}>
                            {state.addOns.includes(ao.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-safari-cream text-sm font-medium">{ao.label}</span>
                        </div>
                        <span className="text-safari-gold font-price font-semibold text-sm flex-shrink-0">+KES {ao.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quote preview */}
                {state.destinationId && (
                  <div className="mt-6 p-4 rounded-xl bg-safari-gold/10 border border-safari-gold/30">
                    <div className="flex items-center justify-between">
                      <span className="text-safari-sand/80 text-sm">Estimated Total</span>
                      <span className="text-2xl font-price font-black text-safari-gold">KES {quote.toLocaleString()}</span>
                    </div>
                    <p className="text-safari-sand/50 text-xs mt-1">Final quote confirmed after team review</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Contact Details */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-display font-bold text-safari-cream mb-6">Your Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-safari-sand/70 font-medium mb-2 block uppercase tracking-widest">Full Name *</label>
                    <Input
                      value={state.customerName}
                      onChange={(e) => update({ customerName: e.target.value })}
                      placeholder="Your full name"
                      className="bg-safari-stone/30 border-safari-warm-brown/40 text-safari-cream placeholder:text-safari-sand/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-safari-sand/70 font-medium mb-2 block uppercase tracking-widest">Phone / WhatsApp *</label>
                    <Input
                      value={state.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      placeholder="+254 7XX XXX XXX"
                      type="tel"
                      className="bg-safari-stone/30 border-safari-warm-brown/40 text-safari-cream placeholder:text-safari-sand/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-safari-sand/70 font-medium mb-2 block uppercase tracking-widest">Email Address</label>
                    <Input
                      value={state.email}
                      onChange={(e) => update({ email: e.target.value })}
                      placeholder="you@example.com"
                      type="email"
                      className="bg-safari-stone/30 border-safari-warm-brown/40 text-safari-cream placeholder:text-safari-sand/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-safari-sand/70 font-medium mb-2 block uppercase tracking-widest">Preferred Payment</label>
                    <div className="flex gap-3">
                      {(["mpesa", "card", "bank"] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => update({ paymentMethod: method })}
                          className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                            state.paymentMethod === method ? "border-safari-gold bg-safari-gold/15 text-safari-gold" : "border-safari-warm-brown/40 text-safari-sand/60"
                          }`}
                        >
                          {method === "mpesa" ? "M-Pesa" : method === "card" ? "Card" : "Bank"}
                        </button>
                      ))}
                    </div>
                    {state.paymentMethod === "mpesa" && (
                      <p className="text-[11px] text-safari-mpesa mt-2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-safari-mpesa inline-block" />
                        You will receive an M-Pesa STK Push after confirmation
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-safari-sand/70 font-medium mb-2 block uppercase tracking-widest">Special Requests</label>
                    <textarea
                      value={state.specialRequests}
                      onChange={(e) => update({ specialRequests: e.target.value })}
                      placeholder="Dietary needs, mobility requirements, special occasions..."
                      rows={3}
                      className="w-full rounded-xl border border-safari-warm-brown/40 bg-safari-stone/30 px-4 py-3 text-sm text-safari-cream placeholder:text-safari-sand/30 focus:outline-none focus:ring-2 focus:ring-safari-gold/40 resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-5 rounded-xl bg-safari-charcoal/50 border border-safari-warm-brown/30 space-y-2 text-sm">
                    <p className="font-display font-semibold text-safari-cream mb-3">Booking Summary</p>
                    <div className="flex justify-between text-safari-sand/80">
                      <span>Destination</span>
                      <span className="font-medium text-safari-cream">{dest?.name || "—"}</span>
                    </div>
                    <div className="flex justify-between text-safari-sand/80">
                      <span>Date</span>
                      <span className="font-medium text-safari-cream">{state.startDate || "—"}</span>
                    </div>
                    <div className="flex justify-between text-safari-sand/80">
                      <span>Travellers</span>
                      <span className="font-medium text-safari-cream">{state.groupSize} person{state.groupSize > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between text-safari-sand/80">
                      <span>Charter</span>
                      <span className="font-medium text-safari-cream capitalize">{state.charterType}</span>
                    </div>
                    <div className="border-t border-safari-warm-brown/30 pt-2 flex justify-between">
                      <span className="font-semibold text-safari-sand">Estimated Total</span>
                      <span className="font-price font-black text-safari-gold text-lg">KES {quote.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Success */}
            {step === 5 && (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-safari-gold/15 border-2 border-safari-gold flex items-center justify-center mx-auto mb-6 animate-pulse-gold"
                >
                  <Check className="w-10 h-10 text-safari-gold" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold text-safari-cream mb-3">
                  Safari Confirmed!
                </h2>
                {bookingRef && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safari-gold/15 border border-safari-gold/40 mb-5">
                    <span className="text-safari-sand/70 text-sm">Booking Reference:</span>
                    <span className="font-price font-bold text-safari-gold tracking-widest">{bookingRef}</span>
                  </div>
                )}
                <p className="text-safari-sand/70 mb-8 max-w-md mx-auto">
                  Our team will contact you within 2 hours on <strong className="text-safari-cream">{state.phone}</strong> to confirm your {dest?.name} adventure.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1fba58] text-white font-bold text-sm transition-colors">
                    Chat on WhatsApp
                  </a>
                  <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-safari-gold/40 text-safari-gold hover:bg-safari-gold/10 font-semibold text-sm transition-colors">
                    Back to Home
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
              disabled={step === 1}
              className="text-safari-sand/70 hover:text-safari-cream gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => Math.min(4, s + 1) as Step)}
                disabled={!canProceed()}
                className="gap-2 bg-safari-gold hover:bg-safari-gold/90 text-safari-charcoal font-bold rounded-full px-8"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting || !canProceed()}
                className="gap-2 bg-safari-gold hover:bg-safari-gold/90 text-safari-charcoal font-bold rounded-full px-8"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-safari-charcoal/30 border-t-safari-charcoal animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Booking
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Trust indicators */}
        {step < 5 && (
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-safari-sand/40">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-safari-emerald" />
              {BRAND.license}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-safari-gold" />
              2hr Response Guarantee
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
