import { create } from 'zustand';
import { Project, Task, ID } from '@/lib/types';

interface ProjectFilters {
  status?: string;
  teamId?: string;
  search?: string;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
}

interface TaskFilters {
  projectId?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  search?: string;
}

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  projectFilters: ProjectFilters;
  tasks: Task[];
  selectedTask: Task | null;
  taskFilters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  // Project actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: ID, project: Partial<Project>) => void;
  deleteProject: (id: ID) => void;
  setSelectedProject: (project: Project | null) => void;
  setProjectFilters: (filters: ProjectFilters) => void;

  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: ID, task: Partial<Task>) => void;
  deleteTask: (id: ID) => void;
  setSelectedTask: (task: Task | null) => void;
  setTaskFilters: (filters: TaskFilters) => void;

  // Status actions
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectsStore = create<ProjectsState>()((set) => ({
  projects: [],
  selectedProject: null,
  projectFilters: {},
  tasks: [],
  selectedTask: null,
  taskFilters: {},
  isLoading: false,
  error: null,

  // Project actions
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updatedProject } : project
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setProjectFilters: (filters) => set({ projectFilters: filters }),

  // Task actions
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setTaskFilters: (filters) => set({ taskFilters: filters }),

  // Status actions
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 