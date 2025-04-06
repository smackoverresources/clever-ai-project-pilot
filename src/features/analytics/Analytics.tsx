import React from 'react';
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  Clock,
  Activity,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`h-4 w-4 ${trend === 'down' && 'rotate-180'}`} />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const metrics = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Active Projects',
      value: '45',
      change: '+8.2%',
      trend: 'up' as const,
      icon: <Activity className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Avg. Completion Time',
      value: '12.3 days',
      change: '-5.1%',
      trend: 'down' as const,
      icon: <Clock className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track and analyze your project metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Project Progress</h3>
            <LineChartIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-4 h-[300px] rounded-lg bg-muted" />
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Task Distribution</h3>
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-4 h-[300px] rounded-lg bg-muted" />
        </div>
        <div className="col-span-2 rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Team Performance</h3>
            <BarChartIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-4 h-[300px] rounded-lg bg-muted" />
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Resource Usage</h3>
            <PieChartIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-4 h-[300px] rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
} 