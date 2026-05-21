import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IListing extends Document {
  category: 'housing' | 'town-shop' | 'campus-shop';
  title: string;
  description?: string;
  price: number;
  priceType: 'per-year' | 'per-month';
  negotiable: boolean;

  // Housing
  housingType?: 'room' | 'self-contained' | 'room-and-parlour' | 'flat' | 'apartment' | 'boys-quarter' | 'mini-flat';
  furnished?: boolean;
  nearUNN?: boolean;
  distanceFromGate?: string;
  amenities?: string[];
  location?: string;

  // Town shop
  townArea?: 'ogige-market' | 'international-market' | 'university-road' | 'hilltop' | 'odim' | 'town-center' | 'enugu-road' | 'other';
  shopType?: string;

  // Campus shop
  campusZone?: 'SUB' | 'faculty-canteen' | 'hostel-area' | 'library-axis' | 'engineering-area' | 'medical-area' | 'main-gate' | 'back-gate' | 'sports-complex' | 'other';
  allocationLetterAvailable?: boolean;

  // Common
  photos: string[];
  agentName: string;
  agentPhone: string;
  agentWhatsApp?: string;
  available: boolean;
  featured: boolean;
  verified: boolean;
  views: number;
  postedAt: Date;
  expiresAt?: Date;
}

const ListingSchema = new Schema<IListing>({
  category: {
    type: String,
    enum: ['housing', 'town-shop', 'campus-shop'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  priceType: { type: String, enum: ['per-year', 'per-month'], default: 'per-year' },
  negotiable: { type: Boolean, default: false },

  // Housing fields
  housingType: {
    type: String,
    enum: ['room', 'self-contained', 'room-and-parlour', 'flat', 'apartment', 'boys-quarter', 'mini-flat'],
  },
  furnished: { type: Boolean },
  nearUNN: { type: Boolean },
  distanceFromGate: { type: String },
  amenities: [{ type: String }],
  location: { type: String },

  // Town shop fields
  townArea: {
    type: String,
    enum: ['ogige-market', 'international-market', 'university-road', 'hilltop', 'odim', 'town-center', 'enugu-road', 'other'],
  },
  shopType: { type: String },

  // Campus shop fields
  campusZone: {
    type: String,
    enum: ['SUB', 'faculty-canteen', 'hostel-area', 'library-axis', 'engineering-area', 'medical-area', 'main-gate', 'back-gate', 'sports-complex', 'other'],
  },
  allocationLetterAvailable: { type: Boolean },

  // Common fields
  photos: [{ type: String }],
  agentName: { type: String, required: true },
  agentPhone: { type: String, required: true },
  agentWhatsApp: { type: String },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  postedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const Listing: Model<IListing> =
  mongoose.models.Listing ?? mongoose.model<IListing>('Listing', ListingSchema);

export default Listing;
