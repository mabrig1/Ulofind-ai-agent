/**
 * Seed script — inserts 10 sample listings into MongoDB.
 * Run: npm run seed  (requires MONGODB_URI in .env.local)
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env.local');
  process.exit(1);
}

const ListingSchema = new mongoose.Schema({
  category: String,
  title: String,
  description: String,
  price: Number,
  priceType: String,
  negotiable: Boolean,
  housingType: String,
  furnished: Boolean,
  nearUNN: Boolean,
  distanceFromGate: String,
  amenities: [String],
  location: String,
  campusZone: String,
  allocationLetterAvailable: Boolean,
  townArea: String,
  shopType: String,
  photos: [String],
  agentName: String,
  agentPhone: String,
  agentWhatsApp: String,
  available: Boolean,
  featured: Boolean,
  verified: Boolean,
  views: Number,
  postedAt: Date,
  expiresAt: Date,
});

const Listing = mongoose.models.Listing ?? mongoose.model('Listing', ListingSchema);

const CLOUDINARY_BASE = 'https://res.cloudinary.com/demo/image/upload/v1/samples';

const thirtyDaysFromNow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
};

const seeds = [
  // ── HOUSING (4) ──────────────────────────────────────────────────────────
  {
    category: 'housing',
    title: 'Clean Self-Contained — 5 Mins from UNN Back Gate',
    description:
      'Spacious self-contained room with tiled floor, ceiling fan, and constant borehole water. ' +
      'Very close to UNN back gate — e dey sweet! Landlord is calm, no trouble. ' +
      'Light dey all the time from transformer wey dey compound.',
    price: 120000,
    priceType: 'per-year',
    negotiable: true,
    housingType: 'self-contained',
    furnished: false,
    nearUNN: true,
    distanceFromGate: '5 mins from back gate',
    amenities: ['water', 'light', 'borehole', 'bathroom-inside', 'security'],
    location: 'Hilltop',
    photos: [`${CLOUDINARY_BASE}/house.jpg`],
    agentName: 'Chukwuemeka Obi',
    agentPhone: '08012345678',
    agentWhatsApp: '2348012345678',
    available: true,
    featured: true,
    verified: true,
    views: 47,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
  {
    category: 'housing',
    title: 'Room to Let — Odim, Near UNN Main Gate',
    description:
      'Single room in a quiet compound at Odim. Good for student wey want cheap and clean place. ' +
      'Shared bathroom and toilet. Water and light dey. 3 mins from UNN main gate by keke.',
    price: 65000,
    priceType: 'per-year',
    negotiable: false,
    housingType: 'room',
    furnished: false,
    nearUNN: true,
    distanceFromGate: '3 mins from main gate',
    amenities: ['water', 'light', 'security'],
    location: 'Odim',
    photos: [`${CLOUDINARY_BASE}/outdoor-bench.jpg`],
    agentName: 'Adaeze Nwosu',
    agentPhone: '07098765432',
    agentWhatsApp: '2347098765432',
    available: true,
    featured: false,
    verified: true,
    views: 23,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
  {
    category: 'housing',
    title: 'Furnished Mini-Flat — Independence Layout, Nsukka',
    description:
      'Brand new mini-flat with modern finishing. Kitchen dey inside, sitting room separate from bedroom. ' +
      'All tiles, pop ceiling, 24hr security. Good for working-class or lecturer. ' +
      'Generator available for NEPA wahala. No agent fee.',
    price: 350000,
    priceType: 'per-year',
    negotiable: true,
    housingType: 'mini-flat',
    furnished: true,
    nearUNN: false,
    amenities: ['water', 'light', 'security', 'parking', 'kitchen', 'bathroom-inside', 'fence', 'borehole'],
    location: 'Independence Layout',
    photos: [`${CLOUDINARY_BASE}/people/kitchen-bar.jpg`],
    agentName: 'Emmanuel Eze',
    agentPhone: '08033344455',
    agentWhatsApp: '2348033344455',
    available: true,
    featured: true,
    verified: false,
    views: 89,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
  {
    category: 'housing',
    title: 'Room and Parlour — Hilltop, Nsukka (Near Market)',
    description:
      'Decent room and parlour for family or working couple. Borehole water dey, light constant. ' +
      'Close to Hilltop market, junction keke always available. ' +
      'Landlord very cooperative. Inspection any time — just call.',
    price: 180000,
    priceType: 'per-year',
    negotiable: true,
    housingType: 'room-and-parlour',
    furnished: false,
    nearUNN: false,
    amenities: ['water', 'light', 'borehole', 'bathroom-inside'],
    location: 'Hilltop',
    photos: [`${CLOUDINARY_BASE}/landscapes/landscape-panorama.jpg`],
    agentName: 'Ngozi Eze',
    agentPhone: '09012233445',
    agentWhatsApp: '2349012233445',
    available: true,
    featured: false,
    verified: false,
    views: 31,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },

  // ── CAMPUS SHOPS (3) ─────────────────────────────────────────────────────
  {
    category: 'campus-shop',
    title: 'Food Canteen Space — SUB Area, UNN',
    description:
      'Prime canteen space at the Student Union Building area. Heavy student traffic. ' +
      'Allocation letter available from UNN Works Department. ' +
      'Currently serving light food — snacks, drinks, indomie. Good for expansion. ' +
      '₦380k per year with option to renew.',
    price: 380000,
    priceType: 'per-year',
    negotiable: false,
    campusZone: 'SUB',
    allocationLetterAvailable: true,
    shopType: 'Food canteen',
    photos: [`${CLOUDINARY_BASE}/food/spices.jpg`],
    agentName: 'Ikenna Okafor',
    agentPhone: '08055667788',
    agentWhatsApp: '2348055667788',
    available: true,
    featured: true,
    verified: true,
    views: 112,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
  {
    category: 'campus-shop',
    title: 'Provision Store — Okpara Hostel Area, UNN',
    description:
      'Well-positioned provision store at Okpara male hostel area. ' +
      '24-hour customer base — hostel students always need midnight provisions. ' +
      'Current owner is relocating. Allocation letter ready for transfer. ' +
      'Shelves and fridge cabinet included in handover.',
    price: 250000,
    priceType: 'per-year',
    negotiable: true,
    campusZone: 'hostel-area',
    allocationLetterAvailable: true,
    shopType: 'Provision store',
    photos: [`${CLOUDINARY_BASE}/ecommerce/accessories/shoe.png`],
    agentName: 'Chioma Ani',
    agentPhone: '08077889900',
    agentWhatsApp: '2348077889900',
    available: true,
    featured: false,
    verified: true,
    views: 58,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
  {
    category: 'campus-shop',
    title: 'Stationery/Print Shop — Library Axis, UNN',
    description:
      'Perfect location for stationery and printing business — right at the library axis where ' +
      'students are always printing assignments, projects, and handouts. ' +
      'Allocation letter NOT yet available but process is ongoing. ' +
      'Current occupant leaving end of semester. Good turnover guaranteed.',
    price: 220000,
    priceType: 'per-year',
    negotiable: true,
    campusZone: 'library-axis',
    allocationLetterAvailable: false,
    shopType: 'Stationery & printing',
    photos: [`${CLOUDINARY_BASE}/office/desk-multitools.jpg`],
    agentName: 'Obinna Nwachukwu',
    agentPhone: '07011223344',
    agentWhatsApp: '2347011223344',
    available: true,
    featured: false,
    verified: false,
    views: 34,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },

  // ── TOWN SHOPS (3) ───────────────────────────────────────────────────────
  {
    category: 'town-shop',
    title: 'Lock-Up Shop — Ogige Market, Nsukka',
    description:
      'Spacious lock-up shop at Ogige market main line. Very high foot traffic. ' +
      'Suitable for provisions, phone accessories, clothing or any trade. ' +
      'Running water from borehole inside market. 24hr security at the gate. ' +
      'Previous tenant was electronics — handover immediately.',
    price: 280000,
    priceType: 'per-year',
    negotiable: false,
    townArea: 'ogige-market',
    shopType: 'Lock-up shop',
    photos: [`${CLOUDINARY_BASE}/ecommerce/leather-bag.jpg`],
    agentName: 'Sunday Madu',
    agentPhone: '08099887766',
    agentWhatsApp: '2348099887766',
    available: true,
    featured: true,
    verified: false,
    views: 76,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
  {
    category: 'town-shop',
    title: 'Shop Space — University Road, Near UNN Gate',
    description:
      'Busy shop space on University Road very close to UNN main gate junction. ' +
      'Ideal for fast food, phone repair, or any student-facing business. ' +
      'High visibility — thousands of students pass daily. ' +
      'Rent negotiable for long-term tenants. Caretaker on site.',
    price: 320000,
    priceType: 'per-year',
    negotiable: true,
    townArea: 'university-road',
    shopType: 'Commercial space',
    photos: [`${CLOUDINARY_BASE}/landscapes/avenue.jpg`],
    agentName: 'Patrick Ugwu',
    agentPhone: '09087654321',
    agentWhatsApp: '2349087654321',
    available: true,
    featured: false,
    verified: true,
    views: 91,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
  {
    category: 'town-shop',
    title: "Container Shop — Eke Int'l Market, Nsukka",
    description:
      "Standard 20ft container shop at Eke International Market. " +
      'Very active market days (Eke and Afor). Goods from Onitsha readily available. ' +
      'Good for provisions, palm oil trade, building materials small scale. ' +
      'Receipt of previous payment available — legit handover.',
    price: 160000,
    priceType: 'per-year',
    negotiable: true,
    townArea: 'international-market',
    shopType: 'Container shop',
    photos: [`${CLOUDINARY_BASE}/ecommerce/jewelry/ear-rings.jpg`],
    agentName: 'Nkechi Ibe',
    agentPhone: '08033221100',
    agentWhatsApp: '2348033221100',
    available: true,
    featured: false,
    verified: false,
    views: 19,
    postedAt: new Date(),
    expiresAt: thirtyDaysFromNow(),
  },
];

async function seed() {
  console.log('🌱  Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected.');

  const existing = await Listing.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️   ${existing} listings already exist. Skipping seed.`);
    console.log('    To reseed, drop the listings collection first.');
    await mongoose.disconnect();
    return;
  }

  console.log('📝  Inserting 10 sample listings…');
  await Listing.insertMany(seeds);
  console.log('✅  Done. 10 listings inserted successfully.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
