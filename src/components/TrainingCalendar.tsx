import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trainingProgram, WorkoutType } from '@/data/trainingProgram';

interface TrainingCalendarProps {
  startDate: Date;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  completedWorkouts: Set<number>;
  onDayClick: (day: number) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWorkoutDotColor(type: WorkoutType): string {
  switch (type) {
    case 'steady':
      return 'bg-workout-steady';
    case 'intervals':
      return 'bg-workout-intervals';
    case 'race':
      return 'bg-workout-race';
    case 'rest':
      return 'bg-workout-rest';
    default:
      return 'bg-muted-foreground';
  }
}

export function TrainingCalendar({
  startDate,
  currentMonth,
  onMonthChange,
  completedWorkouts,
  onDayClick,
}: TrainingCalendarProps) {
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Array<{
      date: Date;
      dayNumber: number | null;
      workout: typeof trainingProgram[0] | null;
      isCompleted: boolean;
      isToday: boolean;
      isInProgram: boolean;
    }> = [];
    
    // Add empty days for start of week
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({
        date: new Date(year, month, -firstDay.getDay() + i + 1),
        dayNumber: null,
        workout: null,
        isCompleted: false,
        isToday: false,
        isInProgram: false,
      });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      
      const startDateNormalized = new Date(startDate);
      startDateNormalized.setHours(0, 0, 0, 0);
      
      const diffTime = date.getTime() - startDateNormalized.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const dayNumber = diffDays >= 0 && diffDays < 28 ? diffDays + 1 : null;
      const workout = dayNumber ? trainingProgram[dayNumber - 1] : null;
      
      days.push({
        date,
        dayNumber,
        workout,
        isCompleted: dayNumber ? completedWorkouts.has(dayNumber) : false,
        isToday: date.getTime() === today.getTime(),
        isInProgram: dayNumber !== null,
      });
    }
    
    // Add trailing days
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push({
          date: new Date(year, month + 1, i + 1),
          dayNumber: null,
          workout: null,
          isCompleted: false,
          isToday: false,
          isInProgram: false,
        });
      }
    }
    
    return days;
  }, [currentMonth, startDate, completedWorkouts]);

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h3 className="text-lg font-semibold text-foreground">{monthYear}</h3>
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div 
            key={day} 
            className="text-center text-xs text-muted-foreground font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => day.dayNumber && onDayClick(day.dayNumber)}
            disabled={!day.isInProgram}
            className={cn(
              "aspect-square p-1 rounded-lg flex flex-col items-center justify-center relative transition-all",
              day.isInProgram && "hover:bg-muted cursor-pointer",
              day.isToday && "ring-2 ring-primary",
              day.isCompleted && "bg-success/20",
              !day.isInProgram && "opacity-40"
            )}
          >
            <span className={cn(
              "text-sm",
              day.isToday ? "text-primary font-bold" : "text-foreground"
            )}>
              {day.date.getDate()}
            </span>
            {day.workout && (
              <div className="flex gap-0.5 mt-0.5">
                <div 
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    getWorkoutDotColor(day.workout.type)
                  )} 
                />
                {day.isCompleted && (
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-workout-steady" />
          <span className="text-xs text-muted-foreground">Steady</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-workout-intervals" />
          <span className="text-xs text-muted-foreground">Intervals</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-workout-race" />
          <span className="text-xs text-muted-foreground">Race</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Complete</span>
        </div>
      </div>
    </div>
  );
}
