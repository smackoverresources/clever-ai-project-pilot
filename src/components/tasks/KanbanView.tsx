import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskMove?: (taskId: string, newStatus: Task['status']) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export function KanbanView({ tasks, onTaskClick, onTaskMove }: KanbanViewProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [targetColumn, setTargetColumn] = useState<string | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setTargetColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedTask && onTaskMove && draggedTask.status !== columnId) {
      onTaskMove(draggedTask.id, columnId as Task['status']);
    }
    setDraggedTask(null);
    setTargetColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setTargetColumn(null);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        return (
          <div
            key={column.id}
            className="space-y-4"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <h2 className="text-lg font-semibold">
              {column.title} ({columnTasks.length})
            </h2>
            <div
              className={`min-h-[200px] p-4 rounded-lg transition-colors ${
                targetColumn === column.id ? 'bg-gray-50' : ''
              }`}
            >
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onDragEnd={handleDragEnd}
                  className={`mb-4 ${
                    draggedTask?.id === task.id ? 'opacity-50' : ''
                  }`}
                >
                  <Card
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onTaskClick(task)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{task.assignee}</span>
                      <span className="text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
} 