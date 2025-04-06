import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  Clock,
  MessageSquare,
  Users,
  AlertCircle,
  Link as LinkIcon,
  MoreVertical,
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Sarah Wilson',
    avatar: 'SW',
    content: 'Started working on the implementation. Will update once the first phase is complete.',
    timestamp: '2024-04-05T10:30:00Z',
  },
  {
    id: '2',
    author: 'Mike Johnson',
    avatar: 'MJ',
    content: 'Looking good so far. Let me know if you need any help with the API integration.',
    timestamp: '2024-04-05T11:15:00Z',
  },
];

function CommentSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Comments</h3>
        <span className="text-sm text-muted-foreground">{mockComments.length} comments</span>
      </div>
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
              {comment.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
          SW
        </div>
        <div className="flex-1">
          <textarea
            placeholder="Add a comment..."
            className="min-h-[80px] w-full rounded-md border p-2 text-sm"
          />
          <div className="mt-2 flex justify-end">
            <button className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskDetails() {
  const { taskId } = useParams();

  return (
    <div className="container space-y-8 py-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Design system implementation
            </h1>
            <button className="rounded-full p-1 hover:bg-accent">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-muted-foreground">Task ID: {taskId}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-1 text-sm font-medium shadow-sm hover:bg-accent">
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy Link
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
            <CheckSquare className="mr-2 h-4 w-4" />
            Mark Complete
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Description</h3>
            <p className="mt-2 text-muted-foreground">
              Implement the new design system across all pages of the application.
              This includes updating components, typography, colors, and spacing to
              match the new design guidelines.
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <CommentSection />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Details</h3>
            <dl className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Priority
                </dt>
                <dd>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    High
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Status
                </dt>
                <dd>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    In Progress
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </dt>
                <dd className="text-sm">Apr 10, 2024</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Assignee
                </dt>
                <dd className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    SW
                  </div>
                  <span className="text-sm">Sarah Wilson</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Activity</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                  MJ
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Mike Johnson</span>{' '}
                    <span className="text-muted-foreground">
                      added a comment
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                  SW
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Sarah Wilson</span>{' '}
                    <span className="text-muted-foreground">
                      updated the status
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 