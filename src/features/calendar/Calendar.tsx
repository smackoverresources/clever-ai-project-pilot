import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { addMonths, format, subMonths } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'deadline' | 'reminder';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date(2024, 3, 15),
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Project Deadline',
    date: new Date(2024, 3, 20),
    type: 'deadline',
  },
  {
    id: '3',
    title: 'Review Session',
    date: new Date(2024, 3, 18),
    type: 'meeting',
  },
];

export default function Calendar() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [events] = React.useState<Event[]>(mockEvents);

  const handlePreviousMonth = () => {
    setDate(subMonths(date, 1));
  };

  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };

  return (
    <div className="container space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and manage your events.
          </p>
        </div>
        <Button className="inline-flex items-center justify-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {format(date, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{event.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {format(event.date, 'MMM d')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground capitalize">
                  {event.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 