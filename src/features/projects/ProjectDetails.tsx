import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  Clock,
  MessageSquare,
  Users,
  FileText,
  Mail,
  Phone,
  Building,
  X,
  Plus,
} from 'lucide-react';
import { mockProjects, mockPeople, mockTasks as mockTasksData, mockTeams } from '@/lib/mockData';
import { Project, Task as TaskType, Person } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectApi, taskApi, peopleApi } from '@/lib/services/api';
import { toast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee: string;
  assigneeId?: string;
  dueDate: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

async function getProjectTasks(project: Project): Promise<Task[]> {
  try {
    return await taskApi.getProjectTasks(project.id);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return [];
  }
}

async function getProjectTeam(project: Project) {
  try {
    const teamMembers = await peopleApi.getProjectTeam(project.id);
    return teamMembers.map(person => ({
      id: person.id,
      name: person.name,
      role: person.role,
      avatar: person.name.split(' ').map(n => n[0]).join('')
    }));
  } catch (error) {
    console.error('Error fetching project team:', error);
    return [];
  }
}

function TaskList({ 
  tasks, 
  projectId, 
  onAddTask 
}: { 
  tasks: Task[], 
  projectId: string,
  onAddTask: (taskId: string) => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadAvailableTasks();
  }, [projectId, tasks]);

  async function loadAvailableTasks() {
    try {
      const tasks = await taskApi.getAvailableTasks(projectId);
      setAvailableTasks(tasks);
    } catch (error) {
      console.error('Error loading available tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load available tasks",
        variant: "destructive"
      });
    }
  }

  const handleAddTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      await onAddTask(taskId);
      toast({
        title: "Success",
        description: "Task added to project",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {availableTasks.length > 0 ? (
              availableTasks.map((task) => (
                <DropdownMenuItem
                  key={task.id}
                  onClick={() => handleAddTask(task.id)}
                >
                  {task.title}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No available tasks</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow p-4">
            <Link 
              to={`/tasks/${task.id}`}
              className="block hover:text-primary transition-colors"
            >
              <h4 className="font-medium text-gray-900">{task.title}</h4>
            </Link>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[task.status]}`}>
                {task.status}
              </span>
              {task.assigneeId ? (
                <Link 
                  to={`/people/${task.assigneeId}`}
                  className="hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {task.assignee}
                  </span>
                </Link>
              ) : (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {task.assignee}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {task.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const personSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  teamId: z.string().min(1, 'Please select a team'),
  status: z.enum(['active', 'inactive']),
  type: z.enum(['in-house', 'external']),
  assignedProjects: z.array(z.string()),
  assignedTasks: z.array(z.string()),
});

type PersonFormValues = z.infer<typeof personSchema>;

function TeamSection({ 
  members, 
  projectId,
  onAddMember
}: { 
  members: TeamMember[], 
  projectId: string,
  onAddMember: (personId: string) => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<Person[]>([]);

  useEffect(() => {
    loadAvailableMembers();
  }, [projectId, members]);

  async function loadAvailableMembers() {
    try {
      const people = await peopleApi.getAvailablePeople(projectId);
      setAvailableMembers(people);
    } catch (error) {
      console.error('Error loading available members:', error);
      toast({
        title: "Error",
        description: "Failed to load available team members",
        variant: "destructive"
      });
    }
  }

  const handleAddMember = async (personId: string) => {
    setIsLoading(true);
    try {
      await onAddMember(personId);
      toast({
        title: "Success",
        description: "Team member added to project",
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: selectedMember?.name || '',
      email: '',
      role: selectedMember?.role || '',
      teamId: '',
      status: 'active',
      type: 'in-house',
      assignedProjects: [],
      assignedTasks: [],
    },
  });

  React.useEffect(() => {
    if (selectedMember) {
      const person = mockPeople.find(p => p.id === selectedMember.id);
      if (person) {
        form.reset({
          name: person.name,
          email: person.email,
          role: person.role,
          teamId: person.teamId,
          status: person.status,
          type: person.type,
          assignedProjects: person.assignedProjects || [],
          assignedTasks: person.assignedTasks || [],
        });
      }
    }
  }, [selectedMember, form]);

  const handleSave = (data: PersonFormValues) => {
    // In a real app, this would update the backend
    console.log('Saving member:', data);
    setSelectedMember(null);
  };

  // Get available projects with team information
  const availableProjects = React.useMemo(() => {
    const person = selectedMember ? mockPeople.find(p => p.id === selectedMember.id) : null;
    return mockProjects
      .filter(project => !person?.assignedProjects?.includes(project.id))
      .map(project => ({
        ...project,
        teamName: mockTeams.find(team => team.id === project.teamId)?.name || 'Unknown Team',
        isDifferentTeam: project.teamId !== person?.teamId
      }));
  }, [selectedMember]);

  // Get available tasks for the selected projects
  const availableTasks = React.useMemo(() => {
    const selectedProjects = form.watch('assignedProjects');
    return mockTasksData.filter(task => selectedProjects.includes(task.projectId));
  }, [form.watch('assignedProjects')]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team Members</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {availableMembers.length > 0 ? (
              availableMembers.map((person) => (
                <DropdownMenuItem
                  key={person.id}
                  onClick={() => handleAddMember(person.id)}
                >
                  {person.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No available members</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium mr-4">
              {member.avatar}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Make changes to the team member's information here.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedProjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Projects</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentProjects = field.value || [];
                        const newProjects = currentProjects.includes(value)
                          ? currentProjects.filter(p => p !== value)
                          : [...currentProjects, value];
                        field.onChange(newProjects);
                      }}
                      value={field.value?.[0] || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select projects" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id} className="flex flex-col items-start">
                            <div>{project.name}</div>
                            {project.isDifferentTeam && (
                              <div className="text-xs text-muted-foreground">
                                {project.teamName}
                              </div>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value?.map((projectId) => {
                        const project = mockProjects.find(p => p.id === projectId);
                        const team = project ? mockTeams.find(t => t.id === project.teamId) : null;
                        return project ? (
                          <div key={project.id} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm">
                            <span>{project.name}</span>
                            {team && team.id !== selectedMember?.teamId && (
                              <span className="text-xs text-muted-foreground">({team.name})</span>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => {
                                field.onChange(field.value?.filter(p => p !== project.id));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTasks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Tasks</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentTasks = field.value || [];
                        const newTasks = currentTasks.includes(value)
                          ? currentTasks.filter(t => t !== value)
                          : [...currentTasks, value];
                        field.onChange(newTasks);
                      }}
                      value={field.value?.[0] || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tasks" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value?.map((taskId) => {
                        const task = mockTasksData.find(t => t.id === taskId);
                        return task ? (
                          <div key={task.id} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm">
                            {task.title}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => {
                                field.onChange(field.value?.filter(t => t !== task.id));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setSelectedMember(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadProject();
  }, [projectId]);

  async function loadProject() {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const project = await projectApi.getProject(projectId);
      if (project) {
        setCurrentProject(project);
        const [projectTasks, projectTeam] = await Promise.all([
          getProjectTasks(project),
          getProjectTeam(project)
        ]);
        setTasks(projectTasks);
        setTeam(projectTeam);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddTask = async (taskId: string) => {
    if (!currentProject) return;
    try {
      const updatedProject = await projectApi.addTaskToProject(currentProject.id, taskId);
      setCurrentProject(updatedProject);
      const projectTasks = await getProjectTasks(updatedProject);
      setTasks(projectTasks);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error; // Re-throw to be handled by the TaskList component
    }
  };

  const handleAddMember = async (personId: string) => {
    if (!currentProject) return;
    try {
      const updatedProject = await projectApi.addMemberToProject(currentProject.id, personId);
      setCurrentProject(updatedProject);
      const projectTeam = await getProjectTeam(updatedProject);
      setTeam(projectTeam);
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error; // Re-throw to be handled by the TeamSection component
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight">Project not found</h1>
        <p className="text-muted-foreground mt-2">
          No project found with ID: {projectId}
        </p>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const dueDate = new Date(currentProject.endDate || '');
  const timeLeft = dueDate.getTime() - new Date().getTime();
  const weeksLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24 * 7));
  const dueText = weeksLeft > 0 ? `Due in ${weeksLeft} week${weeksLeft === 1 ? '' : 's'}` : 'Past due';

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{currentProject.name}</h1>
        <p className="text-muted-foreground">
          {currentProject.description}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Timeline</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">{progress}%</p>
          <p className="text-xs text-muted-foreground">{dueText}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Tasks</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">{completedTasks}/{totalTasks}</p>
          <p className="text-xs text-muted-foreground">Tasks completed</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Team</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">{team.length}</p>
          <p className="text-xs text-muted-foreground">Active members</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Status</p>
          </div>
          <p className="mt-2 text-2xl font-semibold capitalize">{currentProject.status}</p>
          <p className="text-xs text-muted-foreground">Current status</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TaskList 
          tasks={tasks} 
          projectId={currentProject.id} 
          onAddTask={handleAddTask}
        />
        <TeamSection 
          members={team} 
          projectId={currentProject.id}
          onAddMember={handleAddMember}
        />
      </div>
    </div>
  );
} 