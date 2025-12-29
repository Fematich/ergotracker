-- Create table for storing user's training program settings
CREATE TABLE public.training_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing completed workouts
CREATE TABLE public.completed_workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  workout_day INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(device_id, workout_day)
);

-- Enable RLS on both tables
ALTER TABLE public.training_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_workouts ENABLE ROW LEVEL SECURITY;

-- Create policies for training_settings (device-based access)
CREATE POLICY "Anyone can view their own settings" 
ON public.training_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert settings" 
ON public.training_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their own settings" 
ON public.training_settings 
FOR UPDATE 
USING (true);

-- Create policies for completed_workouts (device-based access)
CREATE POLICY "Anyone can view completed workouts" 
ON public.completed_workouts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert completed workouts" 
ON public.completed_workouts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete their completed workouts" 
ON public.completed_workouts 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_training_settings_updated_at
BEFORE UPDATE ON public.training_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();