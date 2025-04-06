import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
  onNewProject: () => void;
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onProjectSelect,
  onNewProject,
}: ProjectSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <Select value={selectedProjectId} onValueChange={onProjectSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onNewProject}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
    </div>
  );
} 