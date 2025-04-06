import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useApiStore } from '@/store/api';
import { Project, Task, Person } from '../types';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or other storage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// Generic request function
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance(config);
    return response as T;
  } catch (error) {
    throw error;
  }
}

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      request({
        method: 'POST',
        url: '/auth/login',
        data: { email, password },
      }),
    register: (data: { email: string; password: string; name: string }) =>
      request({
        method: 'POST',
        url: '/auth/register',
        data,
      }),
    logout: () =>
      request({
        method: 'POST',
        url: '/auth/logout',
      }),
  },

  // User endpoints
  users: {
    getCurrent: () =>
      request({
        method: 'GET',
        url: '/users/me',
      }),
    update: (data: Partial<{ name: string; email: string }>) =>
      request({
        method: 'PATCH',
        url: '/users/me',
        data,
      }),
    updatePassword: (data: { currentPassword: string; newPassword: string }) =>
      request({
        method: 'POST',
        url: '/users/me/password',
        data,
      }),
  },

  // Project endpoints
  projects: {
    getAll: (params?: { page?: number; limit?: number }) =>
      request({
        method: 'GET',
        url: '/projects',
        params,
      }),
    getById: (id: string) =>
      request({
        method: 'GET',
        url: `/projects/${id}`,
      }),
    create: (data: { title: string; description: string }) =>
      request({
        method: 'POST',
        url: '/projects',
        data,
      }),
    update: (id: string, data: Partial<{ title: string; description: string }>) =>
      request({
        method: 'PATCH',
        url: `/projects/${id}`,
        data,
      }),
    delete: (id: string) =>
      request({
        method: 'DELETE',
        url: `/projects/${id}`,
      }),
  },

  // Task endpoints
  tasks: {
    getAll: (params?: { projectId?: string; page?: number; limit?: number }) =>
      request({
        method: 'GET',
        url: '/tasks',
        params,
      }),
    getById: (id: string) =>
      request({
        method: 'GET',
        url: `/tasks/${id}`,
      }),
    create: (data: {
      title: string;
      description: string;
      projectId: string;
    }) =>
      request({
        method: 'POST',
        url: '/tasks',
        data,
      }),
    update: (
      id: string,
      data: Partial<{
        title: string;
        description: string;
        status: string;
      }>
    ) =>
      request({
        method: 'PATCH',
        url: `/tasks/${id}`,
        data,
      }),
    delete: (id: string) =>
      request({
        method: 'DELETE',
        url: `/tasks/${id}`,
      }),
  },

  // Team endpoints
  teams: {
    getAll: (params?: { page?: number; limit?: number }) =>
      request({
        method: 'GET',
        url: '/teams',
        params,
      }),
    getById: (id: string) =>
      request({
        method: 'GET',
        url: `/teams/${id}`,
      }),
    create: (data: { name: string; description: string }) =>
      request({
        method: 'POST',
        url: '/teams',
        data,
      }),
    update: (id: string, data: Partial<{ name: string; description: string }>) =>
      request({
        method: 'PATCH',
        url: `/teams/${id}`,
        data,
      }),
    delete: (id: string) =>
      request({
        method: 'DELETE',
        url: `/teams/${id}`,
      }),
  },

  // Resource endpoints
  resources: {
    getAll: (params?: { projectId?: string; page?: number; limit?: number }) =>
      request({
        method: 'GET',
        url: '/resources',
        params,
      }),
    getById: (id: string) =>
      request({
        method: 'GET',
        url: `/resources/${id}`,
      }),
    upload: (file: File, projectId: string) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      return request({
        method: 'POST',
        url: '/resources/upload',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    delete: (id: string) =>
      request({
        method: 'DELETE',
        url: `/resources/${id}`,
      }),
  },
}; 