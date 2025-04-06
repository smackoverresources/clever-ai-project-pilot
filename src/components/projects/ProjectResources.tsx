import * as React from 'react';
import { Resource, Project } from '@/lib/types';
import { mockResources } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface ProjectResourcesProps {
  project: Project;
}

export function ProjectResources({ project }: ProjectResourcesProps) {
  const [resources] = React.useState<Resource[]>(mockResources);

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

  // Filter resources for this project (in a real app, this would use project.resourceIds)
  const projectResources = resources.filter(resource => 
    resource.projectId === project.id
  );

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Project Resources</h2>
          <Button>Upload Resource</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectResources.map((resource) => (
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
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
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