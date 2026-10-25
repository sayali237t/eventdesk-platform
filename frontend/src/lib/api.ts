import { HealthStatus, RequirementFormData, SubmittedRequirement } from '../types';

const API_BASE = ((import.meta as any).env?.VITE_API_URL || '').replace(/\/$/, '');

export interface SubmitResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    requirement?: SubmittedRequirement;
  };
}

export async function submitRequirement(formData: RequirementFormData): Promise<SubmitResponse> {
  // Extract only category-specific requirements based on selected category to avoid stale fields
  let categoryRequirements: Record<string, any> = {};

  if (formData.category === 'planner') {
    const {
      expectedAttendees,
      budget,
      eventDuration,
      servicesRequired,
      otherServiceSpecification,
      eventTheme,
      additionalNotes,
    } = formData.planner;
    categoryRequirements = {
      expectedAttendees: Number(expectedAttendees),
      budget,
      ...(eventDuration ? { eventDuration } : {}),
      ...(servicesRequired && servicesRequired.length > 0 ? { servicesRequired } : {}),
      ...(servicesRequired?.includes('Other') && otherServiceSpecification?.trim()
        ? { otherServiceSpecification: otherServiceSpecification.trim() }
        : {}),
      ...(eventTheme ? { eventTheme: eventTheme.trim() } : {}),
      ...(additionalNotes ? { additionalNotes: additionalNotes.trim() } : {}),
    };
  } else if (formData.category === 'performer') {
    const {
      performanceType,
      otherPerformanceType,
      performanceDuration,
      numberOfPerformers,
      soundSystemRequired,
      equipmentRequirements,
      additionalNotes,
    } = formData.performer;
    categoryRequirements = {
      performanceType,
      ...(performanceType === 'Other' && otherPerformanceType?.trim()
        ? { otherPerformanceType: otherPerformanceType.trim() }
        : {}),
      performanceDuration,
      ...(numberOfPerformers ? { numberOfPerformers: Number(numberOfPerformers) } : {}),
      ...(soundSystemRequired !== null && soundSystemRequired !== undefined
        ? { soundSystemRequired }
        : {}),
      ...(equipmentRequirements ? { equipmentRequirements: equipmentRequirements.trim() } : {}),
      ...(additionalNotes ? { additionalNotes: additionalNotes.trim() } : {}),
    };
  } else if (formData.category === 'crew') {
    const {
      crewType,
      otherCrewType,
      numberOfPeopleRequired,
      workingDuration,
      equipmentRequired,
      specificSkillsRequired,
      additionalNotes,
    } = formData.crew;
    categoryRequirements = {
      crewType,
      ...(crewType === 'Other' && otherCrewType?.trim()
        ? { otherCrewType: otherCrewType.trim() }
        : {}),
      ...(numberOfPeopleRequired ? { numberOfPeopleRequired: Number(numberOfPeopleRequired) } : {}),
      ...(workingDuration ? { workingDuration } : {}),
      ...(equipmentRequired !== null && equipmentRequired !== undefined
        ? { equipmentRequired }
        : {}),
      ...(specificSkillsRequired ? { specificSkillsRequired: specificSkillsRequired.trim() } : {}),
      ...(additionalNotes ? { additionalNotes: additionalNotes.trim() } : {}),
    };
  }

  const payload = {
    eventName: formData.eventName.trim(),
    eventType: formData.eventType,
    ...(formData.eventType === 'Other' && formData.customEventType?.trim()
      ? { customEventType: formData.customEventType.trim() }
      : {}),
    eventDate: formData.eventDate,
    endDate: formData.endDate ? formData.endDate : null,
    location: formData.location.trim(),
    venue: formData.venue ? formData.venue.trim() : '',
    category: formData.category,
    requirements: categoryRequirements,
  };

  const response = await fetch(`${API_BASE}/api/requirements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      (data && data.message) ||
        'Unable to submit your requirement. Please try again.'
    );
  }

  return data;
}

export async function fetchRequirement(id: string): Promise<SubmittedRequirement> {
  const response = await fetch(`${API_BASE}/api/requirements/${id}`);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Requirement not found');
  }
  return data.data;
}

export async function fetchAllRequirements(category?: string): Promise<SubmittedRequirement[]> {
  const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  const response = await fetch(`${API_BASE}/api/requirements${query}`);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch requirements');
  }
  return data.data || [];
}

export async function fetchHealthStatus(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE}/api/health`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error('Failed to fetch health status');
  }
  return data;
}

export async function seedSampleDatabaseRecords(): Promise<SubmittedRequirement[]> {
  const response = await fetch(`${API_BASE}/api/requirements/seed`, {
    method: 'POST',
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to seed sample records');
  }
  return data.data || [];
}
