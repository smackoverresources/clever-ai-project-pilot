import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
};

export function ListView({ tasks, onTaskClick }: ListViewProps) {
  return (
    <div className="space-y-4">
      {tasks.map(task => (
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
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
              <span className="text-gray-500">
                Est: {task.estimatedHours}h
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 