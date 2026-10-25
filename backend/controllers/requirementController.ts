import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequirementModel, StoredRequirement } from '../models/Requirement.ts';
import { INITIAL_SEED_DATA, isMongoConnected, memoryRequirements } from '../config/database.ts';

const ALLOWED_KEYS_BY_CATEGORY: Record<string, string[]> = {
  planner: [
    'expectedAttendees',
    'budget',
    'eventDuration',
    'servicesRequired',
    'otherServiceSpecification',
    'eventTheme',
    'additionalNotes',
  ],
  performer: [
    'performanceType',
    'otherPerformanceType',
    'performanceDuration',
    'numberOfPerformers',
    'soundSystemRequired',
    'equipmentRequirements',
    'additionalNotes',
  ],
  crew: [
    'crewType',
    'otherCrewType',
    'numberOfPeopleRequired',
    'workingDuration',
    'equipmentRequired',
    'specificSkillsRequired',
    'additionalNotes',
  ],
};

/**
 * Strictly strips any keys from `requirements` that do not belong to the chosen `category`.
 */
export function sanitizeCategoryRequirements(
  category: string,
  rawRequirements: Record<string, any>
): Record<string, any> {
  const allowedKeys = ALLOWED_KEYS_BY_CATEGORY[category] || [];
  const sanitized: Record<string, any> = {};

  for (const key of allowedKeys) {
    const val = rawRequirements[key];
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val) && val.length === 0) continue;
      sanitized[key] = val;
    }
  }

  return sanitized;
}

export function validateRequirementPayload(body: any): { isValid: boolean; error?: string } {
  const {
    eventName,
    eventType,
    customEventType,
    eventDate,
    endDate,
    location,
    category,
    requirements,
  } = body;

  if (!eventName || typeof eventName !== 'string' || !eventName.trim()) {
    return { isValid: false, error: 'Event name is required.' };
  }

  const validEventTypes = [
    'Wedding',
    'Corporate Event',
    'College Event',
    'Concert / Festival',
    'Private Party',
    'Other',
  ];
  if (!eventType || !validEventTypes.includes(eventType)) {
    return { isValid: false, error: 'Please select a valid event type.' };
  }

  if (eventType === 'Other' && (!customEventType || !String(customEventType).trim())) {
    return { isValid: false, error: 'Please specify the custom event type.' };
  }

  if (!eventDate || typeof eventDate !== 'string') {
    return { isValid: false, error: 'Event date is required.' };
  }

  const startDateObj = new Date(`${eventDate}T00:00:00`);
  if (isNaN(startDateObj.getTime())) {
    return { isValid: false, error: 'Event date must be a valid date.' };
  }

  // Ensure eventDate is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startDateObj < today) {
    return { isValid: false, error: 'Event start date cannot be in the past.' };
  }

  if (endDate) {
    const endDateObj = new Date(`${endDate}T00:00:00`);
    if (isNaN(endDateObj.getTime())) {
      return { isValid: false, error: 'End date must be a valid date.' };
    }
    if (endDateObj < startDateObj) {
      return { isValid: false, error: 'End date cannot precede the event start date.' };
    }
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return { isValid: false, error: 'Location / City is required.' };
  }

  if (!category || !['planner', 'performer', 'crew'].includes(category)) {
    return { isValid: false, error: 'Please select a valid requirement category.' };
  }

  if (!requirements || typeof requirements !== 'object') {
    return { isValid: false, error: 'Category requirements details are required.' };
  }

  if (category === 'planner') {
    if (
      requirements.expectedAttendees === undefined ||
      requirements.expectedAttendees === null ||
      isNaN(Number(requirements.expectedAttendees)) ||
      Number(requirements.expectedAttendees) < 1
    ) {
      return { isValid: false, error: 'Expected attendees must be a positive number.' };
    }
    if (!requirements.budget || typeof requirements.budget !== 'string') {
      return { isValid: false, error: 'Event budget is required.' };
    }
  } else if (category === 'performer') {
    if (!requirements.performanceType || typeof requirements.performanceType !== 'string') {
      return { isValid: false, error: 'Performance type is required.' };
    }
    if (
      requirements.performanceType === 'Other' &&
      (!requirements.otherPerformanceType || !String(requirements.otherPerformanceType).trim())
    ) {
      return { isValid: false, error: 'Please specify the custom performance type.' };
    }
    if (!requirements.performanceDuration || typeof requirements.performanceDuration !== 'string') {
      return { isValid: false, error: 'Performance duration is required.' };
    }
    if (
      requirements.numberOfPerformers !== undefined &&
      requirements.numberOfPerformers !== null &&
      requirements.numberOfPerformers !== '' &&
      (isNaN(Number(requirements.numberOfPerformers)) || Number(requirements.numberOfPerformers) < 1)
    ) {
      return { isValid: false, error: 'Number of performers must be a positive number.' };
    }
  } else if (category === 'crew') {
    if (!requirements.crewType || typeof requirements.crewType !== 'string') {
      return { isValid: false, error: 'Crew type is required.' };
    }
    if (
      requirements.crewType === 'Other' &&
      (!requirements.otherCrewType || !String(requirements.otherCrewType).trim())
    ) {
      return { isValid: false, error: 'Please specify the custom crew type.' };
    }
    if (
      requirements.numberOfPeopleRequired !== undefined &&
      requirements.numberOfPeopleRequired !== null &&
      requirements.numberOfPeopleRequired !== '' &&
      (isNaN(Number(requirements.numberOfPeopleRequired)) ||
        Number(requirements.numberOfPeopleRequired) < 1)
    ) {
      return { isValid: false, error: 'Number of people required must be a positive number.' };
    }
  }

  return { isValid: true };
}

// POST /api/requirements
export async function createRequirement(req: Request, res: Response) {
  try {
    const validation = validateRequirementPayload(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error || 'Please provide all required fields.',
      });
    }

    const {
      eventName,
      eventType,
      customEventType,
      eventDate,
      endDate,
      location,
      venue,
      category,
      requirements,
    } = req.body;

    // Strictly whitelist only fields belonging to the selected category
    const sanitizedRequirements = sanitizeCategoryRequirements(category, requirements);

    if (isMongoConnected()) {
      const doc = new RequirementModel({
        eventName: eventName.trim(),
        eventType,
        customEventType: eventType === 'Other' && customEventType ? customEventType.trim() : '',
        eventDate,
        endDate: endDate || null,
        location: location.trim(),
        venue: venue ? venue.trim() : '',
        category,
        requirements: sanitizedRequirements,
      });

      const saved = await doc.save();
      return res.status(201).json({
        success: true,
        message: 'Requirement submitted successfully',
        data: {
          id: saved._id.toString(),
          requirement: saved,
        },
      });
    } else {
      const generatedId = new mongoose.Types.ObjectId().toString();
      const newRequirement: StoredRequirement = {
        _id: generatedId,
        eventName: eventName.trim(),
        eventType,
        customEventType: eventType === 'Other' && customEventType ? customEventType.trim() : '',
        eventDate,
        endDate: endDate || null,
        location: location.trim(),
        venue: venue ? venue.trim() : '',
        category,
        requirements: sanitizedRequirements,
        createdAt: new Date().toISOString(),
      };

      memoryRequirements.unshift(newRequirement);

      return res.status(201).json({
        success: true,
        message: 'Requirement submitted successfully',
        data: {
          id: generatedId,
          requirement: newRequirement,
        },
      });
    }
  } catch (error: any) {
    console.error('Submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit your requirement. Please try again.',
    });
  }
}

// GET /api/requirements?category=planner|performer|crew
export async function getRequirements(req: Request, res: Response) {
  try {
    const categoryFilter = req.query.category as string | undefined;
    const validCategories = ['planner', 'performer', 'crew'];
    const hasCategoryFilter = categoryFilter && validCategories.includes(categoryFilter);

    if (isMongoConnected()) {
      const query = hasCategoryFilter ? { category: categoryFilter } : {};
      const records = await RequirementModel.find(query).sort({ createdAt: -1 }).limit(50);
      return res.json({
        success: true,
        data: records,
      });
    } else {
      const filtered = hasCategoryFilter
        ? memoryRequirements.filter((item) => item.category === categoryFilter)
        : memoryRequirements;

      return res.json({
        success: true,
        data: filtered,
      });
    }
  } catch (error: any) {
    console.error('Fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve requirements',
    });
  }
}

// GET /api/requirements/:id
export async function getRequirementById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Requirement not found.' });
      }
      const record = await RequirementModel.findById(id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Requirement not found.' });
      }
      return res.json({ success: true, data: record });
    } else {
      const record = memoryRequirements.find((item) => item._id === id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Requirement not found.' });
      }
      return res.json({ success: true, data: record });
    }
  } catch (error: any) {
    console.error('Fetch by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching requirement details.',
    });
  }
}

// POST /api/requirements/seed
export async function seedSampleRequirements(_req: Request, res: Response) {
  try {
    if (isMongoConnected()) {
      for (const sample of INITIAL_SEED_DATA) {
        await RequirementModel.findOneAndUpdate(
          { eventName: sample.eventName, category: sample.category },
          { $setOnInsert: sample },
          { upsert: true, new: true }
        );
      }
      const records = await RequirementModel.find().sort({ createdAt: -1 }).limit(50);
      return res.json({
        success: true,
        message: 'Sample records upserted into MongoDB.',
        data: records,
      });
    } else {
      return res.json({
        success: true,
        message: 'Using in-memory sample records.',
        data: memoryRequirements,
      });
    }
  } catch (error: any) {
    console.error('Seed error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed sample requirements.',
    });
  }
}

// GET /api/health
export async function getHealthStatus(_req: Request, res: Response) {
  const connected = isMongoConnected();
  let count = memoryRequirements.length;
  if (connected) {
    try {
      count = await RequirementModel.countDocuments();
    } catch {
      // fallback
    }
  }

  res.json({
    status: 'ok',
    database: connected ? 'mongodb' : 'in-memory-fallback',
    connected,
    submissionsCount: count,
    timestamp: new Date().toISOString(),
  });
}
