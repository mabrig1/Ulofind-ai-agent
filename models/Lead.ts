import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  listingId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  message?: string;
  contacted: boolean;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
  buyerName: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  buyerEmail: { type: String },
  message: { type: String },
  contacted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Lead: Model<ILead> =
  mongoose.models.Lead ?? mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
