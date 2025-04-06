import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Task, Project, Person } from '@/lib/types';
import { mockTasks, mockProjects, mockPeople } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { TaskForm, taskSchema } from './TaskForm';
import { z } from 'zod';

type SortField = 'title' | 'status' | 'priority' | 'dueDate';

interface TaskFilters {
  projectId: string | null;
  status: string | null;
  priority: string | null;
  assigneeId: string | null;
}

export function Tasks() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = React.useState<TaskFilters>({
    projectId: projectId || null,
    status: null,
    priority: null,
    assigneeId: null,
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getProjectName = (projectId: string) => {
    return mockProjects.find(p => p.id === projectId)?.name || 'Unknown Project';
  };

  const getAssigneeNames = (assigneeIds: string[]) => {
    return assigneeIds.map(id => mockPeople.find(p => p.id === id)?.name || 'Unknown').join(', ');
  };

  const getSortedAndFilteredTasks = () => {
    let filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProject = !filters.projectId || task.projectId === filters.projectId;
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesAssignee = !filters.assigneeId || task.assignees.includes(filters.assigneeId);

      return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee;
    });

    if (sortField) {
      filteredTasks.sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'priority':
            comparison = a.priority.localeCompare(b.priority);
            break;
          case 'dueDate':
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filteredTasks;
  };

  const handleClearFilters = () => {
    setFilters({
      projectId: projectId || null,
      status: null,
      priority: null,
      assigneeId: null,
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== null).length;
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setIsDeleteDialogOpen(false);
      setSelectedTask(undefined);
    }
  };

  const handleSaveTask = (data: z.infer<typeof taskSchema>) => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === selectedTask.id ? {
        ...selectedTask,
        ...data,
        updatedAt: new Date().toISOString(),
      } : t));
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
    }
    setIsAddDialogOpen(false);
    setSelectedTask(undefined);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={handleClearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Select
                      value={filters.projectId || ''}
                      onValueChange={(value) => setFilters({ ...filters, projectId: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All projects</SelectItem>
                        {mockProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={filters.status || ''}
                      onValueChange={(value) => setFilters({ ...filters, status: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={filters.priority || ''}
                      onValueChange={(value) => setFilters({ ...filters, priority: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select
                      value={filters.assigneeId || ''}
                      onValueChange={(value) => setFilters({ ...filters, assigneeId: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All assignees</SelectItem>
                        {mockPeople.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
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
      </div>

      <Card>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            {getActiveFilterCount() > 0 && (
              <div className="flex items-center gap-2">
                {filters.projectId && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Project: {getProjectName(filters.projectId)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setFilters({ ...filters, projectId: null })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.status && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {filters.status}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setFilters({ ...filters, status: null })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.priority && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Priority: {filters.priority}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setFilters({ ...filters, priority: null })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.assigneeId && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Assignee: {mockPeople.find(p => p.id === filters.assigneeId)?.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setFilters({ ...filters, assigneeId: null })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assignees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getSortedAndFilteredTasks().map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getProjectName(task.projectId)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {task.assignees.map((assigneeId) => {
                        const person = mockPeople.find(p => p.id === assigneeId);
                        return person ? (
                          <Avatar key={person.id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={person.avatar} />
                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : null;
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === 'done' ? 'default' :
                        task.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.priority === 'urgent' ? 'destructive' :
                        task.priority === 'high' ? 'default' :
                        task.priority === 'medium' ? 'secondary' :
                        'outline'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsAddDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTask(undefined)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 