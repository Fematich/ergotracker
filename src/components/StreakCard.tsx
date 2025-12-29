import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  streak: number;
  totalCompleted: number;
}

export function StreakCard({ streak, totalCompleted }: StreakCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Your Streak</p>
          <div className="flex items-center gap-2 mt-1">
            <Flame 
              className={cn(
                "h-6 w-6",
                streak > 0 ? "text-streak animate-fire-pulse" : "text-muted-foreground"
              )} 
            />
            <span className="text-3xl font-bold text-foreground">{streak}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-sm">Streak Activities</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalCompleted}</p>
        </div>
      </div>
    </div>
  );
}
