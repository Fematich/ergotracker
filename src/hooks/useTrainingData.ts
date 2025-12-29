import { useState, useEffect, useCallback } from 'react';
import { useDeviceId } from './useDeviceId';
import { trainingProgram } from '@/data/trainingProgram';
import {
  addCompletedWorkout,
  fetchCompletedWorkouts,
  fetchTrainingSettings,
  removeCompletedWorkout,
  saveStartDate,
} from '@/lib/api';

interface TrainingSettings {
  startDate: Date | null;
}

interface CompletedWorkout {
  day: number;
  completed_at: string;
}

export function useTrainingData() {
  const deviceId = useDeviceId();
  const [startDate, setStartDateState] = useState<Date | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch training settings and completed workouts together once we have a device ID
  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;
    setLoading(true);

    async function fetchData() {
      try {
        const [settings, completions] = await Promise.all([
          fetchTrainingSettings(deviceId),
          fetchCompletedWorkouts(deviceId),
        ]);

        if (cancelled) return;

        if (settings.startDate) {
          setStartDateState(new Date(settings.startDate));
        }

        if (completions.completed?.length) {
          setCompletedWorkouts(
            new Set(completions.completed.map((w: CompletedWorkout) => w.day))
          );
        } else {
          setCompletedWorkouts(new Set());
        }
      } catch (error) {
        console.error('Failed to load training data', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  const setStartDate = useCallback(async (date: Date) => {
    if (!deviceId) return;

    const dateStr = date.toISOString().split('T')[0];

    try {
      await saveStartDate(deviceId, dateStr);
      setStartDateState(date);
    } catch (error) {
      console.error('Failed to save start date', error);
    }
  }, [deviceId]);

  const toggleWorkoutComplete = useCallback(async (day: number) => {
    if (!deviceId) return;

    const isCompleted = completedWorkouts.has(day);

    if (isCompleted) {
      try {
        await removeCompletedWorkout(deviceId, day);

        setCompletedWorkouts(prev => {
          const next = new Set(prev);
          next.delete(day);
          return next;
        });
      } catch (error) {
        console.error('Failed to remove workout completion', error);
      }
    } else {
      try {
        await addCompletedWorkout(deviceId, day);
        setCompletedWorkouts(prev => new Set([...prev, day]));
      } catch (error) {
        console.error('Failed to save workout completion', error);
      }
    }
  }, [deviceId, completedWorkouts]);

  const isWorkoutCompleted = useCallback((day: number) => {
    return completedWorkouts.has(day);
  }, [completedWorkouts]);

  // Calculate streak
  const calculateStreak = useCallback(() => {
    if (!startDate || completedWorkouts.size === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    const sortedDays = Array.from(completedWorkouts).sort((a, b) => b - a);
    
    // Find current position in program
    const diffTime = today.getTime() - startDate.getTime();
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Count consecutive completed required workouts
    for (let i = Math.min(currentDay, 28); i >= 1; i--) {
      const workout = trainingProgram[i - 1];
      if (!workout.optional && !completedWorkouts.has(i)) {
        break;
      }
      if (completedWorkouts.has(i)) {
        streak++;
      }
    }
    
    return streak;
  }, [startDate, completedWorkouts]);

  // Get weekly completion stats for chart
  const getWeeklyStats = useCallback(() => {
    return [1, 2, 3, 4].map(week => {
      const weekWorkouts = trainingProgram.filter(w => w.weekNumber === week && !w.optional);
      const completed = weekWorkouts.filter(w => completedWorkouts.has(w.day)).length;
      return {
        week,
        completed,
        total: weekWorkouts.length,
      };
    });
  }, [completedWorkouts]);

  return {
    deviceId,
    startDate,
    setStartDate,
    completedWorkouts,
    toggleWorkoutComplete,
    isWorkoutCompleted,
    loading,
    streak: calculateStreak(),
    totalCompleted: completedWorkouts.size,
    weeklyStats: getWeeklyStats(),
  };
}
