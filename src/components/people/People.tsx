import * as React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Filter, X, Pencil } from 'lucide-react';
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
import { Person, Team } from '@/lib/types';
import { mockPeople, mockTeams, mockProjects } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PersonForm } from './PersonForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { useSearchParams, Link } from 'react-router-dom';

type SortField = 'name' | 'role' | 'team' | 'status' | 'joinedDate' | 'type';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  teamId: string | null;
  status: string | null;
  role: string | null;
  type: string | null;
  dateRange: DateRange | null;
}

export default function People() {
  const [people, setPeople] = React.useState<Person[]>(mockPeople);
  const [teams] = React.useState<Team[]>(mockTeams);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedPerson, setSelectedPerson] = React.useState<Person | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [personToDelete, setPersonToDelete] = React.useState<Person | undefined>();
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');
  const [filters, setFilters] = React.useState<FilterState>({
    teamId: null,
    status: null,
    role: null,
    type: null,
    dateRange: null,
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get('type') || 'team-members';
  const projectId = searchParams.get('projectId');
  const view = searchParams.get('view');

  const getSectionTitle = () => {
    if (projectId) {
      const project = mockProjects.find(p => p.id === projectId);
      if (view === 'team') {
        return `${project?.name} - Team Members`;
      } else if (view === 'resources') {
        return `${project?.name} - Resources`;
      }
    }
    switch (currentSection) {
      case 'team-members':
        return 'Team Members';
      case 'clients':
        return 'Clients';
      case 'external-stakeholders':
        return 'External Stakeholders';
      case 'all':
        return 'All People';
      default:
        return 'All People';
    }
  };

  const getSectionFilter = () => {
    if (projectId) {
      const project = mockProjects.find(p => p.id === projectId);
      if (project) {
        return { teamId: project.teamId };
      }
    }
    switch (currentSection) {
      case 'team-members':
        return { type: 'in-house' };
      case 'clients':
        return { type: 'external', role: 'client' };
      case 'external-stakeholders':
        return { type: 'external', role: 'stakeholder' };
      case 'all':
        return {}; // No filter for all people
      default:
        return {}; // Default to showing all people
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredPeople = () => {
    let filtered = people.filter(person => {
      // Text search
      const matchesSearch = 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase());

      // Team filter
      const matchesTeam = !filters.teamId || person.teamId === filters.teamId;

      // Status filter
      const matchesStatus = !filters.status || person.status === filters.status;

      // Role filter
      const matchesRole = !filters.role || person.role === filters.role;

      // Type filter
      const matchesType = !filters.type || person.type === filters.type;

      // Date range filter
      const personDate = new Date(person.joinedDate);
      const matchesDateRange = !filters.dateRange || (
        (!filters.dateRange.from || personDate >= filters.dateRange.from) &&
        (!filters.dateRange.to || personDate <= filters.dateRange.to)
      );

      // Section filter
      const sectionFilter = getSectionFilter();
      const matchesSection = Object.entries(sectionFilter).every(([key, value]) => {
        return person[key as keyof Person] === value;
      });

      return matchesSearch && matchesTeam && matchesStatus && matchesRole && matchesType && matchesDateRange && matchesSection;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'team':
          comparison = getTeamName(a.teamId).localeCompare(getTeamName(b.teamId));
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'joinedDate':
          comparison = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'No Team';
  };

  const handleAddPerson = () => {
    setSelectedPerson(undefined);
    setIsAddDialogOpen(true);
  };

  const handleEditPerson = (person: Person) => {
    setSelectedPerson(person);
    setIsAddDialogOpen(true);
  };

  const handleSavePerson = (data: Omit<Person, 'id'>) => {
    if (selectedPerson) {
      setPeople(people.map(p => 
        p.id === selectedPerson.id 
          ? { ...p, ...data }
          : p
      ));
    } else {
      const newPerson: Person = {
        ...data,
        id: String(people.length + 1),
        avatar: 'https://github.com/shadcn.png', // Default avatar
      };
      setPeople([...people, newPerson]);
    }
    setIsAddDialogOpen(false);
    setSelectedPerson(undefined);
  };

  const handleDeleteClick = (person: Person) => {
    setPersonToDelete(person);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (personToDelete) {
      setPeople(people.filter(p => p.id !== personToDelete.id));
      setIsDeleteDialogOpen(false);
      setPersonToDelete(undefined);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      teamId: null,
      status: null,
      role: null,
      type: null,
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{getSectionTitle()}</h1>
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
                  {currentSection === 'team-members' && (
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
                  )}
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
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={filters.role || ''}
                      onValueChange={(value) => setFilters({ ...filters, role: value || null })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All roles</SelectItem>
                        {currentSection === 'team-members' && (
                          <>
                            <SelectItem value="Developer">Developer</SelectItem>
                            <SelectItem value="Designer">Designer</SelectItem>
                            <SelectItem value="Product Manager">Product Manager</SelectItem>
                          </>
                        )}
                        {currentSection === 'clients' && (
                          <>
                            <SelectItem value="client">Client</SelectItem>
                          </>
                        )}
                        {currentSection === 'external-stakeholders' && (
                          <>
                            <SelectItem value="stakeholder">Stakeholder</SelectItem>
                            <SelectItem value="investor">Investor</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Joined Date</Label>
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
              <Button onClick={handleAddPerson}>
                <Plus className="w-4 h-4 mr-2" />
                Add {getSectionTitle().slice(0, -1)}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedPerson ? 'Edit' : 'Add'} {getSectionTitle().slice(0, -1)}</DialogTitle>
              </DialogHeader>
              <PersonForm
                person={selectedPerson}
                teams={teams}
                onSave={handleSavePerson}
                onCancel={() => {
                  setIsAddDialogOpen(false);
                  setSelectedPerson(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <div className="p-4 flex items-center gap-4">
          <Input
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          {getActiveFilterCount() > 0 && (
            <div className="flex items-center gap-2">
              {filters.teamId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Team: {getTeamName(filters.teamId)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setFilters({ ...filters, teamId: null })}
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
              {filters.role && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Role: {filters.role}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setFilters({ ...filters, role: null })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {filters.type}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setFilters({ ...filters, type: null })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.dateRange && (filters.dateRange.from || filters.dateRange.to) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {filters.dateRange.from?.toLocaleDateString() || ''} - {filters.dateRange.to?.toLocaleDateString() || ''}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setFilters({ ...filters, dateRange: null })}
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
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-1">
                  Role
                  <SortIcon field="role" />
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
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-1">
                  Type
                  <SortIcon field="type" />
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
                onClick={() => handleSort('joinedDate')}
              >
                <div className="flex items-center gap-1">
                  Joined Date
                  <SortIcon field="joinedDate" />
                </div>
              </TableHead>
              <TableHead>Projects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedAndFilteredPeople().map((person) => (
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
                  <Link 
                    to={`/teams/${person.teamId}`}
                    className="text-primary hover:underline"
                  >
                    {getTeamName(person.teamId)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={person.type === 'in-house' ? 'default' : 'outline'}>
                    {person.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={person.status === 'active' ? 'default' : 'secondary'}>
                    {person.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(person.joinedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {person.assignedProjects?.map((projectId) => {
                      const project = mockProjects.find(p => p.id === projectId);
                      if (!project) return null;
                      return (
                        <Link 
                          key={projectId}
                          to={`/projects/${projectId.replace('project-', '')}`}
                          className="hover:no-underline"
                        >
                          <Badge variant="outline" className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground cursor-pointer">
                            {project.name}
                          </Badge>
                        </Link>
                      );
                    })}
                    {(!person.assignedProjects || person.assignedProjects.length === 0 || 
                      !person.assignedProjects.some(projectId => mockProjects.find(p => p.id === projectId))) && (
                      <span className="text-muted-foreground text-sm">No projects</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPerson(person);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(person);
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
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Person</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {personToDelete?.name}? This action cannot be undone.
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