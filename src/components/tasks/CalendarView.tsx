import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.dueDate).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Get unique dates and sort them
  const dates = Object.keys(tasksByDate).sort();

  return (
    <div className="space-y-6">
      {dates.map(date => (
        <div key={date} className="space-y-2">
          <h2 className="text-lg font-semibold">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <div className="space-y-2">
            {tasksByDate[date].map(task => (
              <Card 
                key={task.id} 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                    <Badge variant="outline">{task.status}</Badge>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">{task.assignee}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">
                      {new Date(task.dueDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-gray-500">
                      Est: {task.estimatedHours}h
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 