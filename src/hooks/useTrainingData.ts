import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDeviceId } from './useDeviceId';
import { trainingProgram } from '@/data/trainingProgram';

interface TrainingSettings {
  startDate: Date | null;
}

interface CompletedWorkout {
  workout_day: number;
  completed_at: string;
}

export function useTrainingData() {
  const deviceId = useDeviceId();
  const [startDate, setStartDateState] = useState<Date | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch training settings
  useEffect(() => {
    if (!deviceId) return;

    async function fetchSettings() {
      const { data } = await supabase
        .from('training_settings')
        .select('start_date')
        .eq('device_id', deviceId)
        .maybeSingle();

      if (data) {
        setStartDateState(new Date(data.start_date));
      }
    }

    fetchSettings();
  }, [deviceId]);

  // Fetch completed workouts
  useEffect(() => {
    if (!deviceId) return;

    async function fetchCompletedWorkouts() {
      const { data } = await supabase
        .from('completed_workouts')
        .select('workout_day, completed_at')
        .eq('device_id', deviceId);

      if (data) {
        setCompletedWorkouts(new Set(data.map((w: CompletedWorkout) => w.workout_day)));
      }
      setLoading(false);
    }

    fetchCompletedWorkouts();
  }, [deviceId]);

  const setStartDate = useCallback(async (date: Date) => {
    if (!deviceId) return;

    const dateStr = date.toISOString().split('T')[0];

    const { error } = await supabase
      .from('training_settings')
      .upsert({
        device_id: deviceId,
        start_date: dateStr,
      }, {
        onConflict: 'device_id'
      });

    if (!error) {
      setStartDateState(date);
    }
  }, [deviceId]);

  const toggleWorkoutComplete = useCallback(async (day: number) => {
    if (!deviceId) return;

    const isCompleted = completedWorkouts.has(day);

    if (isCompleted) {
      // Remove completion
      await supabase
        .from('completed_workouts')
        .delete()
        .eq('device_id', deviceId)
        .eq('workout_day', day);

      setCompletedWorkouts(prev => {
        const next = new Set(prev);
        next.delete(day);
        return next;
      });
    } else {
      // Add completion
      await supabase
        .from('completed_workouts')
        .insert({
          device_id: deviceId,
          workout_day: day,
        });

      setCompletedWorkouts(prev => new Set([...prev, day]));
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
