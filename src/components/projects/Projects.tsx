import * as React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Filter, X, Pencil, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Project, Team } from '@/lib/types';
import { mockProjects, mockTeams, mockPeople, mockResources } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProjectForm } from './ProjectForm';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type SortField = 'name' | 'status' | 'team' | 'startDate' | 'endDate';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  teamId: string | null;
  status: string | null;
  dateRange: DateRange | null;
}

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['active', 'completed', 'on-hold']),
  teamId: z.string().min(1, 'Team is required'),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function Projects() {
  const [projects, setProjects] = React.useState<Project[]>(mockProjects);
  const [teams] = React.useState<Team[]>(mockTeams);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | undefined>();
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');
  const [filters, setFilters] = React.useState<FilterState>({
    teamId: null,
    status: null,
    dateRange: null,
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('id');
  const section = searchParams.get('section');
  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredProjects = () => {
    let filtered = projects.filter(project => {
      // Text search
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Team filter
      const matchesTeam = !filters.teamId || project.teamId === filters.teamId;

      // Status filter
      const matchesStatus = !filters.status || project.status === filters.status;

      // Date range filter
      const projectStartDate = new Date(project.startDate);
      const projectEndDate = project.endDate ? new Date(project.endDate) : null;
      const matchesDateRange = !filters.dateRange || (
        (!filters.dateRange.from || projectStartDate >= filters.dateRange.from) &&
        (!filters.dateRange.to || (projectEndDate ? projectEndDate <= filters.dateRange.to : true))
      );

      return matchesSearch && matchesTeam && matchesStatus && matchesDateRange;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'team':
          comparison = getTeamName(a.teamId).localeCompare(getTeamName(b.teamId));
          break;
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'endDate':
          const aEndDate = a.endDate ? new Date(a.endDate).getTime() : Infinity;
          const bEndDate = b.endDate ? new Date(b.endDate).getTime() : Infinity;
          comparison = aEndDate - bEndDate;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'No Team';
  };

  const handleAddProject = () => {
    setSelectedProject(undefined);
    setIsAddDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsAddDialogOpen(true);
  };

  const handleSaveProject = (data: ProjectFormValues) => {
    const projectData: Omit<Project, 'id'> = {
      name: data.name,
      description: data.description,
      status: data.status,
      teamId: data.teamId,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate?.toISOString(),
      assignedPeople: selectedProject?.assignedPeople || [],
      tasks: selectedProject?.tasks || []
    };

    if (selectedProject) {
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...projectData } : p));
    } else {
      setProjects([...projects, { id: crypto.randomUUID(), ...projectData }]);
    }
    setIsAddDialogOpen(false);
    setSelectedProject(undefined);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setIsDeleteDialogOpen(false);
      setProjectToDelete(undefined);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      teamId: null,
      status: null,
      dateRange: null,
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== null && 
      (typeof value !== 'object' || (value.from !== null || value.to !== null))
    ).length;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  // Get project team members
  const getProjectTeam = () => {
    return mockPeople.filter(person => person.teamId === currentProject?.teamId);
  };

  // Get project resources
  const getProjectResources = () => {
    // For demo purposes, just show some resources. In a real app, you'd filter by project
    return mockResources.slice(0, 3);
  };

  // Render project details section
  const renderProjectDetails = () => {
    if (!currentProject) {
      return (
        <Card>
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <SortIcon field="name" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('team')}
                  >
                    <div className="flex items-center gap-1">
                      Team
                      <SortIcon field="team" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('startDate')}
                  >
                    <div className="flex items-center gap-1">
                      Start Date
                      <SortIcon field="startDate" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('endDate')}
                  >
                    <div className="flex items-center gap-1">
                      End Date
                      <SortIcon field="endDate" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedAndFilteredProjects().map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTeamName(project.teamId)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          project.status === 'active' ? 'default' : 
                          project.status === 'completed' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(project);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{currentProject.name}</h2>
            <p className="text-muted-foreground">{currentProject.description}</p>
          </div>
          <Badge 
            variant={
              currentProject.status === 'active' ? 'default' : 
              currentProject.status === 'completed' ? 'secondary' : 
              'outline'
            }
          >
            {currentProject.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="p-4">
              <h3 className="font-medium mb-2">Team</h3>
              <p className="text-sm text-muted-foreground">{getTeamName(currentProject.teamId)}</p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="font-medium mb-2">Start Date</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(currentProject.startDate).toLocaleDateString()}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="font-medium mb-2">End Date</h3>
              <p className="text-sm text-muted-foreground">
                {currentProject.endDate ? new Date(currentProject.endDate).toLocaleDateString() : '-'}
              </p>
            </div>
          </Card>
        </div>

        {section === 'team' && (
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Team Members</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getProjectTeam().map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={person.avatar} />
                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{person.name}</div>
                            <div className="text-sm text-muted-foreground">{person.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{person.role}</TableCell>
                      <TableCell>
                        <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>
                          {person.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={person.type === 'in-house' ? 'default' : 'outline'}>
                          {person.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {section === 'resources' && (
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Project Resources</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getProjectResources().map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-muted-foreground">{resource.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={resource.type === 'document' ? 'default' : 'secondary'}>
                          {resource.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{resource.format}</TableCell>
                      <TableCell>{formatFileSize(resource.size)}</TableCell>
                      <TableCell>{new Date(resource.updatedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="p-6 space-y-6">
      {!currentProject ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Projects</h1>
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
                        <Label>Team</Label>
                        <Select
                          value={filters.teamId || ''}
                          onValueChange={(value) => setFilters({ ...filters, teamId: value || null })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All teams</SelectItem>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <DateRangePicker
                          value={filters.dateRange}
                          onChange={(range) => setFilters({ ...filters, dateRange: range })}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{selectedProject ? 'Edit' : 'Add'} Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm
                    project={selectedProject}
                    teams={teams}
                    onSave={handleSaveProject}
                    onCancel={() => {
                      setIsAddDialogOpen(false);
                      setSelectedProject(undefined);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {renderProjectDetails()}
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/projects')}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            <div className="flex-1" />
            <Button
              variant={!section ? 'default' : 'ghost'}
              onClick={() => navigate(`/projects?id=${currentProject.id}`)}
            >
              Details
            </Button>
            <Button
              variant={section === 'team' ? 'default' : 'ghost'}
              onClick={() => navigate(`/projects?id=${currentProject.id}&section=team`)}
            >
              Team
            </Button>
            <Button
              variant={section === 'resources' ? 'default' : 'ghost'}
              onClick={() => navigate(`/projects?id=${currentProject.id}&section=resources`)}
            >
              Resources
            </Button>
          </div>
          {renderProjectDetails()}
        </>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {projectToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 