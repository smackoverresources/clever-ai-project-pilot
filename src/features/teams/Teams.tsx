import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Users, Briefcase } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: number;
  tasks: number;
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Design Team',
    description: 'Responsible for product design and user experience',
    members: [
      { id: '1', name: 'Sarah Wilson', role: 'Lead Designer', avatar: 'SW' },
      { id: '2', name: 'Alex Chen', role: 'UI Designer', avatar: 'AC' },
      { id: '3', name: 'Emma Davis', role: 'UX Designer', avatar: 'ED' },
    ],
    projects: 4,
    tasks: 15,
  },
  {
    id: '2',
    name: 'Development Team',
    description: 'Frontend and backend development',
    members: [
      { id: '4', name: 'Mike Johnson', role: 'Tech Lead', avatar: 'MJ' },
      { id: '5', name: 'Lisa Brown', role: 'Frontend Dev', avatar: 'LB' },
      { id: '6', name: 'Tom Wilson', role: 'Backend Dev', avatar: 'TW' },
      { id: '7', name: 'James Lee', role: 'Full Stack Dev', avatar: 'JL' },
    ],
    projects: 6,
    tasks: 28,
  },
  {
    id: '3',
    name: 'Marketing Team',
    description: 'Product marketing and growth',
    members: [
      { id: '8', name: 'Kate Miller', role: 'Marketing Lead', avatar: 'KM' },
      { id: '9', name: 'Ryan Park', role: 'Growth Manager', avatar: 'RP' },
    ],
    projects: 3,
    tasks: 12,
  },
];

function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="block rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{team.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>
        </div>
        <div className="flex -space-x-2">
          {team.members.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-sm font-medium"
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          {team.members.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-medium">
              +{team.members.length - 3}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          <span>{team.projects} projects</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{team.members.length} members</span>
        </div>
      </div>
    </Link>
  );
}

export default function Teams() {
  return (
    <div className="container space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and team members.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full rounded-md border pl-9 pr-4 py-2"
          />
        </div>
        <button className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
} 