import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DatePickerSetupProps {
  onDateSelect: (date: Date) => void;
}

export function DatePickerSetup({ onDateSelect }: DatePickerSetupProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleStart = () => {
    if (date) {
      onDateSelect(date);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-xl p-6 border border-border animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Concept2 2K Training
          </h1>
          <p className="text-muted-foreground">
            4-week program to crush your 2K erg test
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              When do you want to start?
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={handleStart}
            disabled={!date}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            Start Training
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-foreground text-sm mb-2">Program Overview:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 4 weeks of structured training</li>
            <li>• Mix of steady state, intervals, and rest</li>
            <li>• Culminates in your 2K test on Day 26</li>
            <li>• Track your progress with daily checkboxes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
