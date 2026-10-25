import { EventCategory, RequirementFormData } from '../types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFutureDateString(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate) return '';
  const formattedStart = formatDisplayDate(startDate);
  if (!endDate || endDate === startDate) return formattedStart;
  const formattedEnd = formatDisplayDate(endDate);
  return `${formattedStart} – ${formattedEnd}`;
}

export function getSampleFormData(category: EventCategory): RequirementFormData {
  const baseEmpty = {
    planner: {
      expectedAttendees: '' as number | '',
      budget: '',
      eventDuration: '',
      servicesRequired: [] as string[],
      otherServiceSpecification: '',
      eventTheme: '',
      additionalNotes: '',
    },
    performer: {
      performanceType: '',
      otherPerformanceType: '',
      performanceDuration: '',
      numberOfPerformers: '' as number | '',
      soundSystemRequired: null as boolean | null,
      equipmentRequirements: '',
      additionalNotes: '',
    },
    crew: {
      crewType: '',
      otherCrewType: '',
      numberOfPeopleRequired: '' as number | '',
      workingDuration: '',
      equipmentRequired: null as boolean | null,
      specificSkillsRequired: '',
      additionalNotes: '',
    },
  };

  if (category === 'planner') {
    return {
      eventName: 'Rohan & Kavya Destination Wedding',
      eventType: 'Wedding',
      customEventType: '',
      eventDate: getFutureDateString(45),
      endDate: getFutureDateString(47),
      location: 'Jaipur',
      venue: 'Rambagh Palace Lawns',
      category: 'planner',
      ...baseEmpty,
      planner: {
        expectedAttendees: 350,
        budget: 'Above ₹5,00,000',
        eventDuration: 'Multi-day',
        servicesRequired: ['Decoration', 'Catering', 'Photography', 'Venue Arrangement'],
        otherServiceSpecification: '',
        eventTheme: 'Royal Rajasthani Heritage & Marigold',
        additionalNotes: 'Need end-to-end guest hospitality, airport transfers, and Sangeet stage coordination.',
      },
    };
  }

  if (category === 'performer') {
    return {
      eventName: 'Horizon Tech & Music Festival 2027',
      eventType: 'Concert / Festival',
      customEventType: '',
      eventDate: getFutureDateString(30),
      endDate: getFutureDateString(31),
      location: 'Mumbai',
      venue: 'Jio World Garden Arena',
      category: 'performer',
      ...baseEmpty,
      performer: {
        performanceType: 'Band / Musician',
        otherPerformanceType: '',
        performanceDuration: '1–2 hours',
        numberOfPerformers: 5,
        soundSystemRequired: true,
        equipmentRequirements: '4 Shure wireless vocal mics, 6 in-ear monitor packs, 2 stereo DI boxes, 8x8ft drum riser',
        additionalNotes: '90-minute high-energy indie-rock headliner set starting at 8:00 PM.',
      },
    };
  }

  return {
    eventName: 'CloudScale Annual Developer Conference',
    eventType: 'Corporate Event',
    customEventType: '',
    eventDate: getFutureDateString(21),
    endDate: '',
    location: 'Hyderabad',
    venue: 'HICC Novotel Convention Centre',
    category: 'crew',
    ...baseEmpty,
    crew: {
      crewType: 'Sound / Audio',
      otherCrewType: '',
      numberOfPeopleRequired: 8,
      workingDuration: '8–12 hours',
      equipmentRequired: false,
      specificSkillsRequired: 'Digital audio console operation, RF frequency coordination for 10 wireless lapel microphones, live stream audio feed routing',
      additionalNotes: 'Crew call time is 7:00 AM for rehearsal with keynote speakers.',
    },
  };
}
