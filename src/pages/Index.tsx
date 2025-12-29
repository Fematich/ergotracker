import { useState, useMemo } from 'react';
import { useTrainingData } from '@/hooks/useTrainingData';
import { trainingProgram } from '@/data/trainingProgram';
import { DatePickerSetup } from '@/components/DatePickerSetup';
import { StreakCard } from '@/components/StreakCard';
import { ActivityChart } from '@/components/ActivityChart';
import { TrainingCalendar } from '@/components/TrainingCalendar';
import { WorkoutCard } from '@/components/WorkoutCard';

const Index = () => {
  const {
    startDate,
    setStartDate,
    completedWorkouts,
    toggleWorkoutComplete,
    isWorkoutCompleted,
    loading,
    streak,
    totalCompleted,
    weeklyStats,
  } = useTrainingData();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(1);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const currentDayNumber = useMemo(() => {
    if (!startDate) return null;
    const diffTime = today.getTime() - startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, today]);

  const weekWorkouts = useMemo(() => {
    return trainingProgram.filter(w => w.weekNumber === selectedWeek);
  }, [selectedWeek]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!startDate) {
    return <DatePickerSetup onDateSelect={setStartDate} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto p-4 pb-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">2K Erg Training</h1>
          <p className="text-muted-foreground text-sm">
            Started {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </header>

        <div className="space-y-4 mb-6">
          <StreakCard streak={streak} totalCompleted={totalCompleted} />
          <ActivityChart weeklyStats={weeklyStats} />
        </div>

        <div className="mb-6">
          <TrainingCalendar
            startDate={startDate}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            completedWorkouts={completedWorkouts}
            onDayClick={(day) => setSelectedWeek(Math.ceil(day / 7))}
          />
        </div>

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedWeek === week
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              Week {week}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {weekWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.day}
              workout={workout}
              isCompleted={isWorkoutCompleted(workout.day)}
              isToday={currentDayNumber === workout.day}
              onToggle={() => toggleWorkoutComplete(workout.day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;