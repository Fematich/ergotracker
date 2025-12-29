export type WorkoutType = 'steady' | 'intervals' | 'race' | 'rest';

export interface Workout {
  day: number;
  weekNumber: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  title: string;
  description: string;
  type: WorkoutType;
  optional: boolean;
  details?: string;
}

// Concept2 4-Week 2K Erg Test Training Program
// Source: https://www.concept2.com/training/plans/2k-erg-test-4-week
export const trainingProgram: Workout[] = [
  // Week 1
  {
    day: 1,
    weekNumber: 1,
    dayOfWeek: 1,
    title: "Steady State Row",
    description: "30-40 minutes at 18-22 spm",
    type: "steady",
    optional: false,
    details: "Focus on technique and maintaining a steady pace. Rate 18-22 strokes per minute."
  },
  {
    day: 2,
    weekNumber: 1,
    dayOfWeek: 2,
    title: "Rest Day",
    description: "Active recovery or complete rest",
    type: "rest",
    optional: true,
    details: "Light stretching or cross-training recommended."
  },
  {
    day: 3,
    weekNumber: 1,
    dayOfWeek: 3,
    title: "Interval Training",
    description: "4 x 1000m with 3 min rest",
    type: "intervals",
    optional: false,
    details: "Target pace: 2K pace + 5-7 seconds. Full recovery between intervals."
  },
  {
    day: 4,
    weekNumber: 1,
    dayOfWeek: 4,
    title: "Rest Day",
    description: "Active recovery",
    type: "rest",
    optional: true,
    details: "Optional light exercise or complete rest."
  },
  {
    day: 5,
    weekNumber: 1,
    dayOfWeek: 5,
    title: "Steady State Row",
    description: "40-50 minutes at 18-22 spm",
    type: "steady",
    optional: false,
    details: "Longer steady row. Keep heart rate in zone 2."
  },
  {
    day: 6,
    weekNumber: 1,
    dayOfWeek: 6,
    title: "Optional Row",
    description: "20-30 min easy rowing",
    type: "steady",
    optional: true,
    details: "Light technique work if feeling good."
  },
  {
    day: 7,
    weekNumber: 1,
    dayOfWeek: 0,
    title: "Rest Day",
    description: "Complete rest",
    type: "rest",
    optional: true,
  },
  
  // Week 2
  {
    day: 8,
    weekNumber: 2,
    dayOfWeek: 1,
    title: "Steady State Row",
    description: "30-40 minutes at 18-22 spm",
    type: "steady",
    optional: false,
    details: "Maintain consistent split times throughout."
  },
  {
    day: 9,
    weekNumber: 2,
    dayOfWeek: 2,
    title: "Rest Day",
    description: "Active recovery",
    type: "rest",
    optional: true,
  },
  {
    day: 10,
    weekNumber: 2,
    dayOfWeek: 3,
    title: "Interval Training",
    description: "5 x 750m with 2:30 rest",
    type: "intervals",
    optional: false,
    details: "Target pace: 2K pace + 3-5 seconds. Push the pace slightly."
  },
  {
    day: 11,
    weekNumber: 2,
    dayOfWeek: 4,
    title: "Rest Day",
    description: "Active recovery",
    type: "rest",
    optional: true,
  },
  {
    day: 12,
    weekNumber: 2,
    dayOfWeek: 5,
    title: "Steady State Row",
    description: "40-50 minutes at 18-22 spm",
    type: "steady",
    optional: false,
    details: "Build aerobic base. Focus on power per stroke."
  },
  {
    day: 13,
    weekNumber: 2,
    dayOfWeek: 6,
    title: "Optional Row",
    description: "20-30 min easy rowing",
    type: "steady",
    optional: true,
  },
  {
    day: 14,
    weekNumber: 2,
    dayOfWeek: 0,
    title: "Rest Day",
    description: "Complete rest",
    type: "rest",
    optional: true,
  },
  
  // Week 3
  {
    day: 15,
    weekNumber: 3,
    dayOfWeek: 1,
    title: "Steady State Row",
    description: "35-45 minutes at 18-22 spm",
    type: "steady",
    optional: false,
    details: "Maintain good form even when fatigued."
  },
  {
    day: 16,
    weekNumber: 3,
    dayOfWeek: 2,
    title: "Rest Day",
    description: "Active recovery",
    type: "rest",
    optional: true,
  },
  {
    day: 17,
    weekNumber: 3,
    dayOfWeek: 3,
    title: "Interval Training",
    description: "6 x 500m with 2 min rest",
    type: "intervals",
    optional: false,
    details: "Target pace: 2K pace + 1-2 seconds. Race simulation intervals."
  },
  {
    day: 18,
    weekNumber: 3,
    dayOfWeek: 4,
    title: "Rest Day",
    description: "Active recovery",
    type: "rest",
    optional: true,
  },
  {
    day: 19,
    weekNumber: 3,
    dayOfWeek: 5,
    title: "Steady State Row",
    description: "30-40 minutes at 18-22 spm",
    type: "steady",
    optional: false,
    details: "Slightly reduced volume. Start tapering."
  },
  {
    day: 20,
    weekNumber: 3,
    dayOfWeek: 6,
    title: "Optional Row",
    description: "15-20 min easy rowing",
    type: "steady",
    optional: true,
  },
  {
    day: 21,
    weekNumber: 3,
    dayOfWeek: 0,
    title: "Rest Day",
    description: "Complete rest",
    type: "rest",
    optional: true,
  },
  
  // Week 4 - Test Week
  {
    day: 22,
    weekNumber: 4,
    dayOfWeek: 1,
    title: "Light Steady State",
    description: "20-25 minutes at 18-20 spm",
    type: "steady",
    optional: false,
    details: "Easy effort. Keep legs fresh for the test."
  },
  {
    day: 23,
    weekNumber: 4,
    dayOfWeek: 2,
    title: "Rest Day",
    description: "Complete rest",
    type: "rest",
    optional: true,
    details: "Rest and prepare mentally for the test."
  },
  {
    day: 24,
    weekNumber: 4,
    dayOfWeek: 3,
    title: "Race Prep",
    description: "10 min warm-up + 4 x 250m starts",
    type: "intervals",
    optional: false,
    details: "Practice your race start strategy. Full recovery between pieces."
  },
  {
    day: 25,
    weekNumber: 4,
    dayOfWeek: 4,
    title: "Rest Day",
    description: "Complete rest",
    type: "rest",
    optional: false,
    details: "Critical rest day before the test."
  },
  {
    day: 26,
    weekNumber: 4,
    dayOfWeek: 5,
    title: "2K ERG TEST",
    description: "Full 2000m test!",
    type: "race",
    optional: false,
    details: "Give it everything! Remember your pacing strategy."
  },
  {
    day: 27,
    weekNumber: 4,
    dayOfWeek: 6,
    title: "Recovery Row",
    description: "15-20 min very light rowing",
    type: "steady",
    optional: true,
    details: "Celebrate and recover!"
  },
  {
    day: 28,
    weekNumber: 4,
    dayOfWeek: 0,
    title: "Rest Day",
    description: "Complete rest",
    type: "rest",
    optional: true,
  },
];

export function getWorkoutForDate(startDate: Date, targetDate: Date): Workout | null {
  const diffTime = targetDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0 || diffDays >= 28) {
    return null;
  }
  
  return trainingProgram[diffDays] || null;
}

export function getDayNumber(startDate: Date, targetDate: Date): number {
  const diffTime = targetDate.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function isWithinProgram(startDate: Date, targetDate: Date): boolean {
  const dayNumber = getDayNumber(startDate, targetDate);
  return dayNumber >= 1 && dayNumber <= 28;
}
