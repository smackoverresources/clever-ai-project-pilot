import * as React from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Filter, X, Pencil, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Resource, Person } from '@/lib/types';
import { mockResources, mockPeople } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'react-router-dom';

type SortField = 'name' | 'type' | 'category' | 'format' | 'createdAt' | 'size';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  type: string | null;
  category: string | null;
  format: string | null;
  createdBy: string | null;
}

export function Resources() {
  const [resources, setResources] = React.useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedResource, setSelectedResource] = React.useState<Resource | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [resourceToDelete, setResourceToDelete] = React.useState<Resource | undefined>();
  const [sortField, setSortField] = React.useState<SortField>('name');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');
  const [filters, setFilters] = React.useState<FilterState>({
    type: null,
    category: null,
    format: null,
    createdBy: null,
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get('type') || 'all';

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'documents':
        return 'Documents';
      case 'templates':
        return 'Templates';
      default:
        return 'All Resources';
    }
  };

  const getSectionFilter = () => {
    switch (currentSection) {
      case 'documents':
        return { type: 'document' };
      case 'templates':
        return { type: 'template' };
      default:
        return {};
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

  const getCreatorName = (createdBy: string) => {
    const creator = mockPeople.find(p => p.id === createdBy);
    return creator ? creator.name : 'Unknown';
  };

  const getSortedAndFilteredResources = () => {
    let filtered = resources.filter(resource => {
      // Text search
      const matchesSearch = 
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      const matchesType = !filters.type || resource.type === filters.type;

      // Category filter
      const matchesCategory = !filters.category || resource.category === filters.category;

      // Format filter
      const matchesFormat = !filters.format || resource.format === filters.format;

      // Creator filter
      const matchesCreator = !filters.createdBy || resource.createdBy === filters.createdBy;

      // Section filter
      const sectionFilter = getSectionFilter();
      const matchesSection = !sectionFilter.type || resource.type === sectionFilter.type;

      return matchesSearch && matchesType && matchesCategory && matchesFormat && matchesCreator && matchesSection;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'format':
          comparison = a.format.localeCompare(b.format);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      type: null,
      category: null,
      format: null,
      createdBy: null,
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== null).length;
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
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getActiveFilterCount()}
                  </span>
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
                      onClick={handleClearFilters}
                      className="h-auto p-0 text-muted-foreground"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={filters.type || ''}
                    onValueChange={(value) => setFilters({ ...filters, type: value || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={filters.category || ''}
                    onValueChange={(value) => setFilters({ ...filters, category: value || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Requirements">Requirements</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Templates">Templates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select
                    value={filters.format || ''}
                    onValueChange={(value) => setFilters({ ...filters, format: value || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="md">Markdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort('name')}
                >
                  Name
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort('type')}
                >
                  Type
                  <SortIcon field="type" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort('category')}
                >
                  Category
                  <SortIcon field="category" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort('format')}
                >
                  Format
                  <SortIcon field="format" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort('size')}
                >
                  Size
                  <SortIcon field="size" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                  <SortIcon field="createdAt" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedAndFilteredResources().map((resource) => (
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
                <TableCell>{resource.category}</TableCell>
                <TableCell>
                  <Badge variant="outline">{resource.format.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>{formatFileSize(resource.size)}</TableCell>
                <TableCell>{new Date(resource.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Handle download
                        window.open(resource.url, '_blank');
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setResourceToDelete(resource);
                        setIsDeleteDialogOpen(true);
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the resource. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (resourceToDelete) {
                  setResources(resources.filter(r => r.id !== resourceToDelete.id));
                  setIsDeleteDialogOpen(false);
                  setResourceToDelete(undefined);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 