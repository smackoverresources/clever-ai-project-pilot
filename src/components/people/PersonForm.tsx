import * as React from 'react';
import { Person, Team, Project, Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mockProjects, mockTasks } from '@/lib/mockData';

const personSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  teamId: z.string().min(1, 'Please select a team'),
  status: z.enum(['active', 'inactive']),
  joinedDate: z.string().min(1, 'Please select a date'),
  type: z.enum(['in-house', 'external']),
  assignedProjects: z.array(z.string()),
  assignedTasks: z.array(z.string()),
});

type PersonFormValues = z.infer<typeof personSchema>;

interface PersonFormProps {
  person?: Person;
  teams: Team[];
  onSave: (data: PersonFormValues) => void;
  onCancel: () => void;
}

export function PersonForm({ person, teams, onSave, onCancel }: PersonFormProps) {
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: person?.name || '',
      email: person?.email || '',
      role: person?.role || '',
      teamId: person?.teamId || '',
      status: person?.status || 'active',
      joinedDate: person?.joinedDate || new Date().toISOString().split('T')[0],
      type: person?.type || 'in-house',
      assignedProjects: person?.assignedProjects || [],
      assignedTasks: person?.assignedTasks || [],
    },
  });

  const onSubmit = (data: PersonFormValues) => {
    onSave(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  // Get available projects for the selected team
  const availableProjects = React.useMemo(() => {
    const teamId = form.watch('teamId');
    return mockProjects.filter(project => project.teamId === teamId);
  }, [form.watch('teamId')]);

  // Get available tasks for the selected projects
  const availableTasks = React.useMemo(() => {
    const selectedProjects = form.watch('assignedProjects');
    return mockTasks.filter(task => selectedProjects.includes(task.projectId));
  }, [form.watch('assignedProjects')]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  {teams.map((team) => (
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
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {field.value?.map((projectId) => {
                  const project = mockProjects.find(p => p.id === projectId);
                  return project ? (
                    <div key={project.id} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm">
                      {project.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => {
                          field.onChange(field.value?.filter(p => p !== project.id));
                        }}
                      >
                        ×
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
                  const task = mockTasks.find(t => t.id === taskId);
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
                        ×
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="in-house">In-house</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="joinedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joined Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {person ? 'Update' : 'Add'} Person
          </Button>
        </div>
      </form>
    </Form>
  );
} 