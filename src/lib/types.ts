export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ViewType = 'kanban' | 'list' | 'calendar';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  teamId: string;
  startDate: string;
  endDate?: string;
  assignedPeople: string[];
  tasks: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];
  dueDate: string;
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  budgetUtilization: number;
  timelineProgress: number;
  teamUtilization: number;
}

export interface AIResponse {
  type: 'advice' | 'suggestion' | 'warning' | 'information';
  content: string;
  timestamp: string;
  context?: {
    projectId?: string;
    taskId?: string;
    metric?: string;
  };
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  avatar: string;
  type: 'in-house' | 'external';
  assignedProjects: string[];
  assignedTasks: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  projects: string[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'document' | 'template';
  description: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  format: string;
  category: string;
  tags: string[];
  createdBy: string;
  projectId: string;
} 