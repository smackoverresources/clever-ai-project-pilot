import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from '@/components/tasks/TaskForm';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project: string;
  projectId: string;
  assignees: string[];
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
}

export default function Tasks() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>();

  const handleNewTask = () => {
    setIsAddDialogOpen(true);
  };

  const handleSaveTask = (taskData: any) => {
    // Here you would typically save the task to your backend
    toast({
      title: "Task created",
      description: "Your new task has been created successfully.",
    });
    setIsAddDialogOpen(false);
    setSelectedTask(undefined);
  };

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Design System Implementation',
      description: 'Implement the new design system across all components',
      status: 'in-progress',
      priority: 'high',
      project: 'Website Redesign',
      projectId: 'proj-1',
      assignee: 'Sarah Chen',
      assignees: ['user-1'],
      dueDate: '2024-04-15T00:00:00Z',
      estimatedHours: 40,
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'API Integration',
      description: 'Integrate the new payment processing API',
      status: 'todo',
      priority: 'medium',
      project: 'E-commerce Platform',
      projectId: 'proj-2',
      assignee: 'John Smith',
      assignees: ['user-2'],
      dueDate: '2024-04-20T00:00:00Z',
      estimatedHours: 24,
      createdAt: '2024-03-02T00:00:00Z',
      updatedAt: '2024-03-02T00:00:00Z',
    },
    {
      id: '3',
      title: 'User Testing',
      description: 'Conduct user testing sessions for the new features',
      status: 'done',
      priority: 'medium',
      project: 'Mobile App',
      projectId: 'proj-3',
      assignee: 'Emily Johnson',
      assignees: ['user-3'],
      dueDate: '2024-04-10T00:00:00Z',
      estimatedHours: 16,
      createdAt: '2024-03-03T00:00:00Z',
      updatedAt: '2024-03-03T00:00:00Z',
    },
  ];

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-muted text-muted-foreground';
      case 'in-progress':
        return 'bg-blue-100 text-blue-500 dark:bg-blue-500/20';
      case 'done':
        return 'bg-green-100 text-green-500 dark:bg-green-500/20';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-muted text-muted-foreground';
      case 'medium':
        return 'bg-yellow-100 text-yellow-500 dark:bg-yellow-500/20';
      case 'high':
        return 'bg-red-100 text-red-500 dark:bg-red-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your tasks across all projects
          </p>
        </div>
        <Button onClick={handleNewTask}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {mockTasks.map((task) => (
          <Link
            key={task.id}
            to={`/tasks/${task.id}`}
            className="block rounded-lg border p-4 hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {getStatusIcon(task.status)}
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Badge variant="outline">{task.project}</Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit' : 'Add'} Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            onSave={handleSaveTask}
            onCancel={() => {
              setIsAddDialogOpen(false);
              setSelectedTask(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 