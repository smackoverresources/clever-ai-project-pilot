
import { Task } from "@/lib/dummy-data";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView = ({ tasks }: CalendarViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Calculate tasks for the selected date
  const selectedDateTasks = date 
    ? tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  // Get all dates with tasks for highlighting in calendar
  const datesWithTasks = tasks.map(task => new Date(task.dueDate));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-slate-400";
      case "Medium": return "bg-blue-400";
      case "High": return "bg-orange-400";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasTasks: datesWithTasks,
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="col-span-1 md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {date ? (
                <>Tasks for {date.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</>
              ) : (
                <>Select a date</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-4">
                {selectedDateTasks.map(task => (
                  <div key={task.id} className="p-4 border rounded-md flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      {task.assignee && (
                        <div className="mt-2 flex items-center">
                          <div className="w-5 h-5 rounded-full bg-pm-blue-100 text-pm-blue-500 flex items-center justify-center text-[10px] font-medium mr-2">
                            {task.assignee.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {task.assignee}
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {date ? "No tasks scheduled for this date" : "Select a date to view tasks"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
