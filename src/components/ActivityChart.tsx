import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface WeeklyStat {
  week: number;
  completed: number;
  total: number;
}

interface ActivityChartProps {
  weeklyStats: WeeklyStat[];
}

export function ActivityChart({ weeklyStats }: ActivityChartProps) {
  const maxTotal = useMemo(() => {
    return Math.max(...weeklyStats.map(s => s.total));
  }, [weeklyStats]);

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <p className="text-muted-foreground text-sm mb-4">Weekly Progress</p>
      <div className="flex items-end justify-between gap-2 h-24">
        {weeklyStats.map((stat) => {
          const heightPercent = (stat.completed / maxTotal) * 100;
          const bgHeightPercent = (stat.total / maxTotal) * 100;
          
          return (
            <div key={stat.week} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full relative rounded-t-sm bg-muted"
                style={{ height: `${bgHeightPercent}%`, minHeight: '4px' }}
              >
                <div 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-500",
                    stat.completed > 0 ? "bg-chart" : "bg-transparent"
                  )}
                  style={{ height: stat.total > 0 ? `${(stat.completed / stat.total) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-muted-foreground">W{stat.week}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 text-xs text-muted-foreground">
        <span>0 workouts</span>
        <span>{maxTotal} workouts</span>
      </div>
    </div>
  );
}
