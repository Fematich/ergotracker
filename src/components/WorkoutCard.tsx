import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Workout, WorkoutType } from '@/data/trainingProgram';

interface WorkoutCardProps {
  workout: Workout;
  isCompleted: boolean;
  isToday: boolean;
  onToggle: () => void;
}

function getWorkoutColor(type: WorkoutType): string {
  switch (type) {
    case 'steady':
      return 'border-workout-steady';
    case 'intervals':
      return 'border-workout-intervals';
    case 'race':
      return 'border-workout-race glow-primary';
    case 'rest':
      return 'border-workout-rest';
    default:
      return 'border-border';
  }
}

function getWorkoutBadgeColor(type: WorkoutType): string {
  switch (type) {
    case 'steady':
      return 'bg-workout-steady/20 text-workout-steady';
    case 'intervals':
      return 'bg-workout-intervals/20 text-workout-intervals';
    case 'race':
      return 'bg-workout-race/20 text-workout-race';
    case 'rest':
      return 'bg-workout-rest/20 text-workout-rest';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function WorkoutCard({ workout, isCompleted, isToday, onToggle }: WorkoutCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg p-4 border-l-4 transition-all animate-fade-in",
        getWorkoutColor(workout.type),
        isCompleted && "opacity-60",
        isToday && "ring-1 ring-primary"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                getWorkoutBadgeColor(workout.type)
              )}
            >
              {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
            </span>
            {workout.optional && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                Optional
              </span>
            )}
            {isToday && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                Today
              </span>
            )}
          </div>
          <h4 className={cn(
            "font-semibold text-foreground",
            isCompleted && "line-through"
          )}>
            Day {workout.day}: {workout.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {workout.description}
          </p>
          {workout.details && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              {workout.details}
            </p>
          )}
        </div>
        <button
          onClick={onToggle}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
            isCompleted 
              ? "bg-success border-success text-success-foreground" 
              : "border-muted-foreground hover:border-primary"
          )}
        >
          {isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4 text-transparent" />
          )}
        </button>
      </div>
    </div>
  );
}
