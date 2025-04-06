import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Users,
  Briefcase,
  BarChart,
  Settings,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
}

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  dueDate: string;
}

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    role: 'Lead Designer',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'SW',
    joinedDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'Alex Chen',
    role: 'UI Designer',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'AC',
    joinedDate: '2023-08-01',
  },
  {
    id: '3',
    name: 'Emma Davis',
    role: 'UX Designer',
    email: 'emma.davis@example.com',
    phone: '+1 (555) 345-6789',
    avatar: 'ED',
    joinedDate: '2023-09-15',
  },
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    status: 'active',
    progress: 65,
    dueDate: '2024-04-15',
  },
  {
    id: '2',
    name: 'Mobile App Design',
    status: 'active',
    progress: 30,
    dueDate: '2024-05-20',
  },
  {
    id: '3',
    name: 'Brand Guidelines',
    status: 'completed',
    progress: 100,
    dueDate: '2024-03-30',
  },
];

function MemberList() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Team Members</h3>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </button>
      </div>
      <div className="divide-y">
        {mockMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                {member.avatar}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 hover:bg-accent">
                <Mail className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-accent">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-full p-2 hover:bg-accent">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectList() {
  const statusColors = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    'on-hold': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Projects</h3>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </button>
      </div>
      <div className="divide-y">
        {mockProjects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{project.name}</h4>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusColors[project.status]
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Due {new Date(project.dueDate).toLocaleDateString()}
              </span>
              <button className="rounded-full p-2 hover:bg-accent">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamDetails() {
  const { teamId } = useParams();

  return (
    <div className="container space-y-8 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design Team</h1>
          <p className="text-muted-foreground">Team ID: {teamId}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Members</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">{mockMembers.length}</p>
          <p className="text-xs text-muted-foreground">Active members</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Projects</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">{mockProjects.length}</p>
          <p className="text-xs text-muted-foreground">Active projects</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Completion</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">78%</p>
          <p className="text-xs text-muted-foreground">Average completion rate</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Active Since</p>
          </div>
          <p className="mt-2 text-2xl font-semibold">8 mo</p>
          <p className="text-xs text-muted-foreground">Team formation</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <MemberList />
        <ProjectList />
      </div>
    </div>
  );
} 