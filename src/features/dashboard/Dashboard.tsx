import React from 'react';
import { Activity, Users, Folder, CheckSquare } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      icon: <Folder className="h-5 w-5 text-primary" />,
      description: '3 projects due this week',
    },
    {
      title: 'Team Members',
      value: '24',
      icon: <Users className="h-5 w-5 text-primary" />,
      description: '8 members online',
    },
    {
      title: 'Tasks',
      value: '45',
      icon: <CheckSquare className="h-5 w-5 text-primary" />,
      description: '15 tasks completed today',
    },
    {
      title: 'Activity',
      value: '89%',
      icon: <Activity className="h-5 w-5 text-primary" />,
      description: 'Higher than last week',
    },
  ];

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold">Recent Activity</h3>
            {/* Activity chart will go here */}
            <div className="mt-4 h-[200px] rounded-lg bg-muted" />
          </div>
        </div>
        <div className="col-span-3 rounded-lg border shadow-sm">
          <div className="p-6">
            <h3 className="font-semibold">Upcoming Tasks</h3>
            {/* Task list will go here */}
            <div className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 