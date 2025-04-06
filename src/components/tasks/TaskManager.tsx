import { useState, useEffect } from 'react';
import { ViewType, Task, Project } from '@/lib/types';
import { mockTasks, mockProjects } from '@/lib/mockData';
import { KanbanView } from './KanbanView';
import { ListView } from './ListView';
import { CalendarView } from './CalendarView';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Calendar, Plus } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { ProjectSelector } from '../projects/ProjectSelector';
import { ProjectForm } from '../projects/ProjectForm';
import { useSearchParams } from 'react-router-dom';

export function TaskManager() {
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0].id);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId && projects.some(p => p.id === projectId)) {
      setSelectedProjectId(projectId);
    }
  }, [searchParams, projects]);

  const filteredTasks = tasks.filter((task) => task.projectId === selectedProjectId);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      projectId: selectedProjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setIsTaskFormOpen(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...taskData,
      id: editingTask.id,
      projectId: editingTask.projectId,
      createdAt: editingTask.createdAt,
      updatedAt: new Date().toISOString(),
    };

    setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setIsProjectFormOpen(false);
  };

  const handleEditProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProject) return;
    
    const updatedProject: Project = {
      ...projectData,
      id: editingProject.id,
      createdAt: editingProject.createdAt,
      updatedAt: new Date().toISOString(),
    };

    setProjects(projects.map(project => project.id === editingProject.id ? updatedProject : project));
    setIsProjectFormOpen(false);
    setEditingProject(undefined);
  };

  const viewComponents = {
    kanban: (
      <KanbanView 
        tasks={filteredTasks} 
        onTaskClick={handleTaskClick} 
        onTaskMove={handleTaskMove}
      />
    ),
    list: <ListView tasks={filteredTasks} onTaskClick={handleTaskClick} />,
    calendar: <CalendarView tasks={filteredTasks} onTaskClick={handleTaskClick} />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <div className="flex items-center space-x-4">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
            onNewProject={() => {
              setEditingProject(undefined);
              setIsProjectFormOpen(true);
            }}
          />
          <div className="flex space-x-2">
            <Button
              variant={currentView === 'kanban' ? 'default' : 'outline'}
              onClick={() => setCurrentView('kanban')}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kanban
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'outline'}
              onClick={() => setCurrentView('list')}
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button
              variant={currentView === 'calendar' ? 'default' : 'outline'}
              onClick={() => setCurrentView('calendar')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button onClick={() => setIsTaskFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      {viewComponents[currentView]}

      {isTaskFormOpen && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? handleEditTask : handleCreateTask}
          onCancel={() => {
            setIsTaskFormOpen(false);
            setEditingTask(undefined);
          }}
        />
      )}

      {isProjectFormOpen && (
        <ProjectForm
          project={editingProject}
          onSave={editingProject ? handleEditProject : handleCreateProject}
          onCancel={() => {
            setIsProjectFormOpen(false);
            setEditingProject(undefined);
          }}
        />
      )}
    </div>
  );
} 