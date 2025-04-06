import React from 'react';
import { useParams } from 'react-router-dom';
import {
  FileText,
  Image as ImageIcon,
  File,
  Link as LinkIcon,
  Download,
  Share2,
  Trash2,
  Settings,
  History,
  MessageSquare,
  Eye,
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface Version {
  id: string;
  version: string;
  updatedBy: string;
  timestamp: string;
  changes: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Sarah Wilson',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Sarah',
    content: 'Updated the design system documentation with new component guidelines.',
    timestamp: '2024-04-05T10:35:00Z',
  },
  {
    id: '2',
    author: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Alex',
    content: 'Added mobile-specific design patterns section.',
    timestamp: '2024-04-05T11:15:00Z',
  },
];

const mockVersions: Version[] = [
  {
    id: '1',
    version: '2.0',
    updatedBy: 'Sarah Wilson',
    timestamp: '2024-04-05T10:30:00Z',
    changes: 'Updated component guidelines and added mobile patterns',
  },
  {
    id: '2',
    version: '1.1',
    updatedBy: 'Mike Johnson',
    timestamp: '2024-04-03T15:45:00Z',
    changes: 'Fixed typos and formatting issues',
  },
  {
    id: '3',
    version: '1.0',
    updatedBy: 'Emma Davis',
    timestamp: '2024-04-01T09:20:00Z',
    changes: 'Initial version of the design system documentation',
  },
];

function CommentSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Comments</h2>
        <span className="text-sm text-muted-foreground">{mockComments.length} comments</span>
      </div>
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          placeholder="Add a comment..."
          className="w-full rounded-md border p-2"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Comment
          </button>
        </div>
      </div>
    </div>
  );
}

function VersionHistory() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Version History</h2>
      <div className="space-y-4">
        {mockVersions.map((version) => (
          <div
            key={version.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Version {version.version}</span>
                <span className="text-sm text-muted-foreground">
                  by {version.updatedBy}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {version.changes}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {new Date(version.timestamp).toLocaleDateString()}
              </span>
              <button className="rounded-full p-2 hover:bg-accent">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResourceDetails() {
  const { id } = useParams();

  return (
    <div className="container space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Design System Documentation.pdf
            </h1>
            <p className="text-muted-foreground">Resource ID: {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
            <Download className="mr-2 h-4 w-4" />
            Download
          </button>
          <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </button>
          <button className="inline-flex items-center justify-center rounded-md border bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
          <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-8">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Preview</h2>
              <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
                <Eye className="mr-2 h-4 w-4" />
                Open
              </button>
            </div>
            <div className="aspect-video rounded-lg border bg-muted" />
          </div>

          <CommentSection />
        </div>

        <div className="space-y-8">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">Project</dt>
                <dd className="font-medium">Website Redesign</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Uploaded by</dt>
                <dd className="font-medium">Sarah Wilson</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Upload date</dt>
                <dd className="font-medium">April 5, 2024</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">File size</dt>
                <dd className="font-medium">2.5 MB</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">File type</dt>
                <dd className="font-medium">PDF Document</dd>
              </div>
            </dl>
          </div>

          <VersionHistory />
        </div>
      </div>
    </div>
  );
} 