// Common Types
export type ID = string;

// User and Organization Types
export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: ID;
  name: string;
  logo?: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

// Project Types
export interface Project {
  id: ID;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  startDate: Date;
  endDate?: Date;
  progress: number;
  assignedPeople: User[];
  tasks: Task[];
  resources: Resource[];
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface Task {
  id: ID;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: ID;
  assignees: User[];
  dueDate?: Date;
  estimatedHours?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Team Types
export interface Team {
  id: ID;
  name: string;
  description: string;
  members: User[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

// Resource Types
export interface Resource {
  id: ID;
  name: string;
  type: 'file' | 'link' | 'document';
  category: 'design' | 'development' | 'marketing' | 'other';
  format?: string;
  url: string;
  size?: number;
  projectId?: ID;
  teamId?: ID;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

// Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Error Types
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
} 