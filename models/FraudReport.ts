import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFraudReport extends Document {
  input: string;
  verdict: 'safe' | 'suspicious' | 'likely_fraud';
  reasoning: string;
  confidence: number;
  createdAt: Date;
}

const FraudReportSchema = new Schema<IFraudReport>(
  {
    input: { type: String, required: true },
    verdict: {
      type: String,
      enum: ['safe', 'suspicious', 'likely_fraud'],
      required: true,
    },
    reasoning: { type: String, required: true },
    confidence: { type: Number, required: true },
  },
  { timestamps: true }
);

const FraudReport: Model<IFraudReport> =
  mongoose.models.FraudReport ??
  mongoose.model<IFraudReport>('FraudReport', FraudReportSchema);

export default FraudReport;
