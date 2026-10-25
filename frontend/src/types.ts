export type EventCategory = 'planner' | 'performer' | 'crew';

export type EventType =
  | 'Wedding'
  | 'Corporate Event'
  | 'College Event'
  | 'Concert / Festival'
  | 'Private Party'
  | 'Other';

export interface PlannerRequirements {
  expectedAttendees: number | '';
  budget: string;
  eventDuration?: string;
  servicesRequired?: string[];
  otherServiceSpecification?: string;
  eventTheme?: string;
  additionalNotes?: string;
}

export interface PerformerRequirements {
  performanceType: string;
  otherPerformanceType?: string;
  performanceDuration: string;
  numberOfPerformers?: number | '';
  soundSystemRequired?: boolean | null;
  equipmentRequirements?: string;
  additionalNotes?: string;
}

export interface CrewRequirements {
  crewType: string;
  otherCrewType?: string;
  numberOfPeopleRequired?: number | '';
  workingDuration?: string;
  equipmentRequired?: boolean | null;
  specificSkillsRequired?: string;
  additionalNotes?: string;
}

export interface RequirementFormData {
  // Step 1: Event Basics
  eventName: string;
  eventType: EventType | '';
  customEventType?: string;
  eventDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: EventCategory | '';

  // Step 2 & 3: Category Specific
  planner: PlannerRequirements;
  performer: PerformerRequirements;
  crew: CrewRequirements;
}

export interface SubmittedRequirement {
  _id: string;
  eventName: string;
  eventType: string;
  customEventType?: string;
  eventDate: string;
  endDate?: string | null;
  location: string;
  venue?: string;
  category: EventCategory;
  requirements: Record<string, any>;
  createdAt: string;
}

export interface HealthStatus {
  status: string;
  database: 'mongodb' | 'in-memory-fallback';
  connected: boolean;
  submissionsCount: number;
  timestamp: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
