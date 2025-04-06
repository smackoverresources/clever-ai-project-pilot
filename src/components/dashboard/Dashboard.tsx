import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockProjects, mockMetrics, mockTasks } from '@/lib/mockData';
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Dashboard() {
  const [selectedProjectId, setSelectedProjectId] = React.useState(mockProjects[0].id);
  const project = mockProjects.find(p => p.id === selectedProjectId) || mockProjects[0];
  const metrics = mockMetrics;
  const projectTasks = mockTasks.filter(task => task.projectId === project.id);

  // Calculate task metrics
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(task => task.status === 'done').length;
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = projectTasks.filter(task => task.status === 'todo').length;

  // Calculate total estimated hours
  const totalHours = projectTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const completedHours = projectTasks
    .filter(task => task.status === 'done')
    .reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

  // Get unique assignees
  const assignees = Array.from(new Set(projectTasks.map(task => task.assignee).filter(Boolean)));

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'done':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'todo':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Task Progress</h3>
            <div className="mt-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">
                  {completedTasks}
                </span>
                <span className="ml-2 text-sm text-gray-500">of {totalTasks} tasks</span>
              </div>
              <Progress value={(completedTasks / totalTasks) * 100} className="mt-2" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Time Progress</h3>
            <div className="mt-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">
                  {completedHours}h
                </span>
                <span className="ml-2 text-sm text-gray-500">of {totalHours}h</span>
              </div>
              <Progress value={(completedHours / totalHours) * 100} className="mt-2" />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Task Distribution</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">To Do</span>
                <span className="font-medium">{todoTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">In Progress</span>
                <span className="font-medium">{inProgressTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Done</span>
                <span className="font-medium">{completedTasks}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Team</h3>
            <div className="mt-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">
                  {assignees.length}
                </span>
                <span className="ml-2 text-sm text-gray-500">members</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {assignees.join(', ')}
              </div>
            </div>
          </Card>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Project Name</h4>
                <p className="mt-1 text-sm text-gray-900">{project.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-sm text-gray-900">{project.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
            <div className="mt-4 space-y-4">
              {projectTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge variant={getStatusVariant(task.status)}>
                        {task.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        <Clock className="inline-block w-3 h-3 mr-1" />
                        {task.estimatedHours}h
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.assignee}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 