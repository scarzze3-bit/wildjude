// Jude Safaris and Adventures - Brand Constants

export const BRAND = {
  name: 'Jude Safaris and Adventures',
  shortName: 'Jude Safaris',
  tagline: 'Where the Nganya Meets the Wild',
  taglineSub: 'Premium Kenyan Expeditions - Luxury Vans, Timeless Circuits',
  phone: '+254 422 832 791',
  whatsapp: '254422832791',
  email: 'blackjudecatie5913@gmail.com',
  website: 'judesafaris.co.ke',
  location: 'Kabarnet, Baringo',
  license: 'KATO Licensed Tour Operator',
} as const;

export const PHONE_DISPLAY = BRAND.phone;

export const WHATSAPP_URL = 'https://wa.me/' + BRAND.whatsapp;

export const WHATSAPP_MESSAGE = (destination?: string) => {
  const msg = destination
    ? 'Hello Jude Safaris! I am interested in booking a trip to ' + destination + '. Please share more details.'
    : 'Hello Jude Safaris! I would like to enquire about your safari packages.';
  return 'https://wa.me/' + BRAND.whatsapp + '?text=' + encodeURIComponent(msg);
};

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/16kHvGDuwT/',
  tiktok: 'https://www.tiktok.com/@judesafaris',
  instagram: 'https://www.instagram.com/judesafaris',
  whatsapp: WHATSAPP_URL,
} as const;

export const LOGO_URL =
  'https://www.dropbox.com/scl/fi/hx1jqsxef1zz940ibzktk/wb.jpeg?rlkey=teccg3icp4p289k6q3g5w65w2&st=euyvj5ja&raw=1';
