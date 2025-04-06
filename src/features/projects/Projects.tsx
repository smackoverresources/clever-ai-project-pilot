import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Users, CheckSquare } from 'lucide-react';
import { mockProjects, mockTasks, mockPeople } from '@/lib/mockData';
import { Project } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

function ProjectCard({ project }: { project: Project }) {
  const statusColors = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    'on-hold': 'bg-yellow-100 text-yellow-700',
  };

  const completedTasks = project.tasks.filter(t => mockTasks.find(mt => mt.id === t)?.status === 'done').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="block rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <Link
        to={`/projects/${project.id.replace('project-', '')}`}
        className="block"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{project.name}</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              statusColors[project.status]
            }`}
          >
            {project.status}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
      </Link>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <Link 
          to={`/tasks?projectId=${project.id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <CheckSquare className="h-4 w-4" />
          <span className="flex-1">Tasks</span>
          <Badge variant="secondary">{completedTasks}/{totalTasks}</Badge>
        </Link>

        <Link 
          to={`/teams/${project.teamId}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Users className="h-4 w-4" />
          <span className="flex-1">Team Members</span>
          <Badge variant="secondary">{project.assignedPeople.length}</Badge>
        </Link>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Due: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No due date'}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <div className="container space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-md border pl-9 pr-4 py-2"
          />
        </div>
        <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
} 