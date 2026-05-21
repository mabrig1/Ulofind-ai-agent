import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  listingId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    listingId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    message: { type: String },
  },
  { timestamps: true }
);

const Lead: Model<ILead> =
  mongoose.models.Lead ?? mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
