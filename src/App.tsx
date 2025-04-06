import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Layout } from './components/layout/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

// Lazy load feature components
const Dashboard = React.lazy(() => import('./features/dashboard/Dashboard'));
const Projects = React.lazy(() => import('./features/projects/Projects'));
const ProjectDetails = React.lazy(() => import('./features/projects/ProjectDetails'));
const Tasks = React.lazy(() => import('./features/tasks/Tasks'));
const TaskDetails = React.lazy(() => import('./features/tasks/TaskDetails'));
const Teams = React.lazy(() => import('./features/teams/Teams'));
const TeamDetails = React.lazy(() => import('./features/teams/TeamDetails'));
const Calendar = React.lazy(() => import('./features/calendar/Calendar'));
const Resources = React.lazy(() => import('./features/resources/Resources'));
const Analytics = React.lazy(() => import('./features/analytics/Analytics'));
const Settings = React.lazy(() => import('./features/settings/Settings'));
const Assistant = React.lazy(() => import('./features/assistant/Assistant'));
const Login = React.lazy(() => import('./features/auth/Login'));
const People = React.lazy(() => import('./components/people/People'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="text-destructive">Something went wrong. Please refresh the page.</div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="dashboard"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Dashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="projects"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Projects />
                      </Suspense>
                    }
                  />
                  <Route
                    path="projects/:projectId/*"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <ProjectDetails />
                      </Suspense>
                    }
                  />
                  <Route
                    path="tasks"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Tasks />
                      </Suspense>
                    }
                  />
                  <Route
                    path="tasks/:taskId"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <TaskDetails />
                      </Suspense>
                    }
                  />
                  <Route
                    path="teams"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Teams />
                      </Suspense>
                    }
                  />
                  <Route
                    path="teams/:teamId"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <TeamDetails />
                      </Suspense>
                    }
                  />
                  <Route
                    path="people"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <People />
                      </Suspense>
                    }
                  />
                  <Route
                    path="calendar"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Calendar />
                      </Suspense>
                    }
                  />
                  <Route
                    path="resources"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Resources />
                      </Suspense>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Analytics />
                      </Suspense>
                    }
                  />
                  <Route
                    path="assistant"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Assistant />
                      </Suspense>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <Suspense fallback={<LoadingFallback />}>
                        <Settings />
                      </Suspense>
                    }
                  />
                </Route>
              </Routes>
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

