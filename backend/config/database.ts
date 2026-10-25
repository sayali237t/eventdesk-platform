import mongoose from 'mongoose';
import { RequirementModel, StoredRequirement } from '../models/Requirement.ts';

let mongoConnected = false;

export const INITIAL_SEED_DATA: Omit<StoredRequirement, '_id'>[] = [
  {
    eventName: 'Aarav & Diya Royal Wedding Reception',
    eventType: 'Wedding',
    customEventType: '',
    eventDate: '2027-03-20',
    endDate: '2027-03-22',
    location: 'Udaipur',
    venue: 'The Leela Palace Courtyard',
    category: 'planner',
    requirements: {
      expectedAttendees: 450,
      budget: 'Above ₹5,00,000',
      eventDuration: 'Multi-day',
      servicesRequired: ['Decoration', 'Catering', 'Photography', 'Venue Arrangement'],
      eventTheme: 'Royal Heritage & Floral Pastel',
      additionalNotes: 'Three-day celebration including Mehendi, Sangeet, and Grand Reception.',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    eventName: 'Nexus Annual Tech & Cultural Fest',
    eventType: 'College Event',
    customEventType: '',
    eventDate: '2027-02-15',
    endDate: '2027-02-16',
    location: 'Pune',
    venue: 'Main Open Air Amphitheatre',
    category: 'performer',
    requirements: {
      performanceType: 'Band / Musician',
      performanceDuration: '1–2 hours',
      numberOfPerformers: 5,
      soundSystemRequired: true,
      equipmentRequirements: '4 wireless microphones, stage monitors, 2 DI boxes, and drum riser',
      additionalNotes: 'Sound check scheduled 2 hours before the headliner slot.',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    eventName: 'NextGen SaaS Founders Summit 2027',
    eventType: 'Corporate Event',
    customEventType: '',
    eventDate: '2027-04-10',
    endDate: null,
    location: 'Bengaluru',
    venue: 'Sheraton Grand Convention Center',
    category: 'crew',
    requirements: {
      crewType: 'Sound / Audio',
      numberOfPeopleRequired: 6,
      workingDuration: '8–12 hours',
      equipmentRequired: false,
      specificSkillsRequired: 'Digital mixing console operation (Yamaha QL5), lapel mic management for 12 keynote speakers',
      additionalNotes: 'Call time is 6:30 AM for stage and AV check.',
    },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const memoryRequirements: StoredRequirement[] = INITIAL_SEED_DATA.map((item, idx) => ({
  _id: `67bcb01a8e23f1001a4e981${idx + 1}`,
  ...item,
}));

export function isMongoConnected(): boolean {
  return mongoConnected && mongoose.connection.readyState === 1;
}

export async function seedDatabaseIfEmpty(): Promise<void> {
  if (!isMongoConnected()) return;
  try {
    for (const sample of INITIAL_SEED_DATA) {
      await RequirementModel.findOneAndUpdate(
        { eventName: sample.eventName, category: sample.category },
        { $setOnInsert: sample },
        { upsert: true, new: true }
      );
    }
  } catch (err: any) {
    console.warn('Could not seed initial sample requirements:', err.message);
  }
}

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!mongoUri || mongoUri.includes('<username>')) {
    console.log('MONGODB_URI not configured. Using seeded in-memory storage fallback.');
    mongoConnected = false;
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    mongoConnected = true;
    console.log('Connected to MongoDB database');
    await seedDatabaseIfEmpty();
  } catch (err: any) {
    console.warn('MongoDB connection failed, using local storage fallback:', err.message);
    mongoConnected = false;
  }
}
