import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHousingMission extends Document {
  sessionId: string;
  userMessage: string;
  intent: 'rent' | 'buy' | 'shop' | 'unknown';
  budgetMax?: number;
  preferredLocations: string[];
  housingTypes: string[];
  nearUNN?: boolean;
  stage: 'discover' | 'shortlist' | 'verify' | 'viewing' | 'decision';
  shortlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const HousingMissionSchema = new Schema<IHousingMission>({
  sessionId: { type: String, required: true, index: true },
  userMessage: { type: String, required: true },
  intent: { type: String, enum: ['rent','buy','shop','unknown'], default: 'unknown' },
  budgetMax: Number,
  preferredLocations: [{ type: String }],
  housingTypes: [{ type: String }],
  nearUNN: Boolean,
  stage: { type: String, enum: ['discover','shortlist','verify','viewing','decision'], default: 'discover' },
  shortlist: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
}, { timestamps: true });

const HousingMission: Model<IHousingMission> = mongoose.models.HousingMission ?? mongoose.model<IHousingMission>('HousingMission', HousingMissionSchema);
export default HousingMission;
