// Jude Safaris and Adventures - Kenya Circuit Catalogue
export interface KenyaCircuit {
  id: string; name: string; slug: string; region: string; county: string;
  tagline: string; highlights: string[]; bestMonths: string; tags: string[];
  priceFrom: number; duration: string; culturalQuote: string;
}
export const KENYA_CIRCUITS: KenyaCircuit[] = [
  { id: "lake-victoria", name: "Lake Victoria", slug: "lake-victoria", region: "Western Kenya", county: "Kisumu",
    tagline: "Where the Rift holds its breath at sunset",
    highlights: ["Dunga Beach", "Sunset Boardwalks", "Hippo Point", "Kisumu Impala Sanctuary"],
    bestMonths: "Jun - Sep, Jan - Feb", tags: ["Lakeside", "Scenic", "Cultural", "Family"],
    priceFrom: 28000, duration: "2 - 4 Days",
    culturalQuote: "The water remembers every story the shore forgets." },
  { id: "homa-bay", name: "Homa Bay", slug: "homa-bay", region: "Western Kenya", county: "Homa Bay",
    tagline: "Islands of legend, trails of heritage",
    highlights: ["Rusinga Island", "Heritage Trails", "Tom Mboya Memorial", "Ruma National Park"],
    bestMonths: "Jul - Oct", tags: ["Heritage", "Island", "Historical", "Wildlife"],
    priceFrom: 32000, duration: "2 - 3 Days",
    culturalQuote: "Every stone on Rusinga Island breathes a name." },
  { id: "baringo", name: "Baringo County", slug: "baringo", region: "Rift Valley", county: "Baringo",
    tagline: "Heat from the earth, calm from the lake",
    highlights: ["Releng Hot Springs", "Rift Valley Escarpment", "Lake Baringo", "Island Camp"],
    bestMonths: "Year-round", tags: ["Hot Springs", "Birding", "Rift Valley", "Wellness"],
    priceFrom: 24000, duration: "1 - 3 Days",
    culturalQuote: "The Rift does not break the land - it reveals its soul." },
  { id: "coastal-circuit", name: "Coastal Circuit", slug: "coastal-circuit", region: "Coast", county: "Mombasa / Kwale",
    tagline: "Old Town spice routes meet Diani turquoise embrace",
    highlights: ["Mombasa Old Town", "Fort Jesus", "Diani Beach", "Swahili Coast"],
    bestMonths: "Oct - Mar", tags: ["Beach", "Historical", "Swahili Culture", "Luxury"],
    priceFrom: 45000, duration: "3 - 6 Days",
    culturalQuote: "The dhow sail knows no hurry - only direction." },
  { id: "northern-frontier", name: "Northern Frontier", slug: "northern-frontier", region: "North Kenya", county: "Samburu",
    tagline: "Sacred stone rises where the wild has no ceiling",
    highlights: ["Mt. Ololokwe", "Samburu National Reserve", "Ewaso Nyiro River", "Reteti Elephant Sanctuary"],
    bestMonths: "Jun - Sep, Jan - Feb", tags: ["Wildlife", "Sacred Sites", "Remote", "Adventure"],
    priceFrom: 55000, duration: "3 - 5 Days",
    culturalQuote: "Ololokwe does not ask to be climbed. It asks to be respected." },
];
export const DESTINATION_REGIONS = ["All", "Western Kenya", "Rift Valley", "Coast", "North Kenya"];
export const DESTINATION_TAGS = ["All", "Wildlife", "Beach", "Heritage", "Scenic", "Wellness", "Adventure", "Luxury"];
export const DESTINATION_IMAGES: Record<string, string> = {
  "lake-victoria": "https://images.unsplash.com/photo-1518982380512-5a3c6f6f5218?w=800",
  "homa-bay": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
  "baringo": "https://images.unsplash.com/photo-1580746738099-b2b7a3c13dd9?w=800",
  "coastal-circuit": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800",
  "northern-frontier": "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800",
};
