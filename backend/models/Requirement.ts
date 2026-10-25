import mongoose from 'mongoose';

export interface StoredRequirement {
  _id: string;
  eventName: string;
  eventType: string;
  customEventType?: string;
  eventDate: string;
  endDate?: string | null;
  location: string;
  venue?: string;
  category: 'planner' | 'performer' | 'crew';
  requirements: Record<string, any>;
  createdAt: string;
}

const requirementSchema = new mongoose.Schema({
  eventName: { type: String, required: true, trim: true },
  eventType: {
    type: String,
    required: true,
    enum: [
      'Wedding',
      'Corporate Event',
      'College Event',
      'Concert / Festival',
      'Private Party',
      'Other',
    ],
  },
  customEventType: { type: String, default: '', trim: true },
  eventDate: { type: String, required: true },
  endDate: { type: String, default: null },
  location: { type: String, required: true, trim: true },
  venue: { type: String, default: '', trim: true },
  category: {
    type: String,
    required: true,
    enum: ['planner', 'performer', 'crew'],
    index: true,
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const RequirementModel =
  mongoose.models.Requirement ||
  mongoose.model('Requirement', requirementSchema);
