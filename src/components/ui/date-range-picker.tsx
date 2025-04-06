import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange as CalendarDateRange } from 'react-day-picker';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  className?: string;
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  ({ value, onChange, className }, ref) => {
    const [date, setDate] = React.useState<CalendarDateRange | undefined>(
      value?.from && value?.to
        ? { from: value.from, to: value.to }
        : value?.from
        ? { from: value.from }
        : undefined
    );

    React.useEffect(() => {
      if (value) {
        setDate(
          value.from && value.to
            ? { from: value.from, to: value.to }
            : value.from
            ? { from: value.from }
            : undefined
        );
      }
    }, [value]);

    const handleSelect = (range: CalendarDateRange | undefined) => {
      setDate(range);
      if (onChange) {
        if (range?.from && range?.to) {
          onChange({ from: range.from, to: range.to });
        } else if (range?.from) {
          onChange({ from: range.from, to: null });
        } else {
          onChange({ from: null, to: null });
        }
      }
    };

    return (
      <div ref={ref} className={cn('grid gap-2', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date?.from && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker }; 