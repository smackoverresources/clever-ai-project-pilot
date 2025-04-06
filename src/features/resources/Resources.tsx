import React from 'react';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  File,
  Link as LinkIcon,
  MoreVertical,
  Download,
  Share2,
  Trash2,
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'document' | 'image' | 'link' | 'other';
  size?: number;
  project: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Design System Documentation.pdf',
    type: 'document',
    size: 2500000,
    project: 'Website Redesign',
    uploadedBy: 'Sarah Wilson',
    uploadedAt: '2024-04-05T10:30:00Z',
    url: '#',
  },
  {
    id: '2',
    name: 'Homepage Mockup.png',
    type: 'image',
    size: 5000000,
    project: 'Website Redesign',
    uploadedBy: 'Alex Chen',
    uploadedAt: '2024-04-04T15:45:00Z',
    url: '#',
  },
  {
    id: '3',
    name: 'API Documentation',
    type: 'link',
    project: 'Mobile App',
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2024-04-03T09:15:00Z',
    url: 'https://api.example.com/docs',
  },
  {
    id: '4',
    name: 'Brand Guidelines.pdf',
    type: 'document',
    size: 3500000,
    project: 'Brand Refresh',
    uploadedBy: 'Emma Davis',
    uploadedAt: '2024-04-02T14:20:00Z',
    url: '#',
  },
];

function ResourceTypeIcon({ type }: { type: Resource['type'] }) {
  switch (type) {
    case 'document':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'image':
      return <ImageIcon className="h-5 w-5 text-green-500" />;
    case 'link':
      return <LinkIcon className="h-5 w-5 text-purple-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
}

function formatFileSize(bytes: number) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function ResourceRow({ resource }: { resource: Resource }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <ResourceTypeIcon type={resource.type} />
        <div>
          <h3 className="font-medium">{resource.name}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Project: {resource.project}</span>
            <span>•</span>
            <span>Uploaded by {resource.uploadedBy}</span>
            {resource.size && (
              <>
                <span>•</span>
                <span>{formatFileSize(resource.size)}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {new Date(resource.uploadedAt).toLocaleDateString()}
        </span>
        <div className="flex items-center">
          <button className="rounded-full p-2 hover:bg-accent">
            <Download className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 hover:bg-accent">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 hover:bg-accent">
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
          <button className="rounded-full p-2 hover:bg-accent">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Resources() {
  return (
    <div className="container space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Manage and organize project resources.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Upload Resource
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full rounded-md border pl-9 pr-4 py-2"
          />
        </div>
        <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="space-y-4">
        {mockResources.map((resource) => (
          <ResourceRow key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
} 