import mongoose, { Schema, Document, Model } from 'mongoose';

interface IAiAnalysis {
  riskLevel: 'safe' | 'caution' | 'danger';
  score: number;
  redFlags: string[];
  greenFlags: string[];
  recommendation: string;
  nextSteps: string[];
}

export interface IFraudReport extends Document {
  listingId?: mongoose.Types.ObjectId;
  documentsUploaded: string[];
  propertyType: 'housing' | 'campus-shop' | 'town-shop';
  userDescription?: string;
  engisResult?: string;
  aiAnalysis?: IAiAnalysis;
  paid: boolean;
  createdAt: Date;
}

const FraudReportSchema = new Schema<IFraudReport>({
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
  documentsUploaded: [{ type: String }],
  propertyType: {
    type: String,
    enum: ['housing', 'campus-shop', 'town-shop'],
    required: true,
  },
  userDescription: { type: String },
  engisResult: { type: String },
  aiAnalysis: {
    riskLevel: { type: String, enum: ['safe', 'caution', 'danger'] },
    score: { type: Number },
    redFlags: [{ type: String }],
    greenFlags: [{ type: String }],
    recommendation: { type: String },
    nextSteps: [{ type: String }],
  },
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const FraudReport: Model<IFraudReport> =
  mongoose.models.FraudReport ??
  mongoose.model<IFraudReport>('FraudReport', FraudReportSchema);

export default FraudReport;
