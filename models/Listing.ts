import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  type: 'housing' | 'shop';
  price: number;
  location: string;
  images: string[];
  contactPhone: string;
  contactEmail?: string;
  whatsapp?: string;
  isVerified: boolean;
  isFlagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['housing', 'shop'], required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    contactPhone: { type: String, required: true },
    contactEmail: { type: String },
    whatsapp: { type: String },
    isVerified: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Listing: Model<IListing> =
  mongoose.models.Listing ?? mongoose.model<IListing>('Listing', ListingSchema);

export default Listing;
