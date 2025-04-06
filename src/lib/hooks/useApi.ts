import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiStore } from '@/store/api';
import { api } from '@/lib/services/api';
import { usePreferencesStore } from '@/store/preferences';

interface UseApiOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  staleTime?: number;
  cacheTime?: number;
}

interface UseMutationOptions<T, V> {
  mutationFn: (variables: V) => Promise<T>;
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: Error, variables: V) => void;
  onSettled?: (data: T | undefined, error: Error | null, variables: V) => void;
  invalidateQueries?: string[];
}

export function useApi<T>({
  key,
  queryFn,
  enabled = true,
  onSuccess,
  onError,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 30 * 60 * 1000, // 30 minutes
}: UseApiOptions<T>) {
  const queryClient = useQueryClient();
  const addNotification = usePreferencesStore((state) => state.addNotification);

  return useQuery({
    queryKey: [key],
    queryFn,
    enabled,
    staleTime,
    cacheTime,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message,
        userId: 'current', // Replace with actual user ID
      });
      onError?.(error);
    },
  });
}

export function useApiMutation<T, V>({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
  invalidateQueries = [],
}: UseMutationOptions<T, V>) {
  const queryClient = useQueryClient();
  const addNotification = usePreferencesStore((state) => state.addNotification);

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidate and refetch queries
      invalidateQueries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: [query] });
      });

      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed successfully',
        userId: 'current', // Replace with actual user ID
      });

      onSuccess?.(data, variables);
    },
    onError: (error: Error, variables) => {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message,
        userId: 'current', // Replace with actual user ID
      });

      onError?.(error, variables);
    },
    onSettled: (data, error, variables) => {
      onSettled?.(data, error, variables as V);
    },
  });
}

// Pre-built hooks for common operations
export function useProjects(enabled = true) {
  return useApi({
    key: 'projects',
    queryFn: () => api.projects.getAll(),
    enabled,
  });
}

export function useProject(id: string, enabled = true) {
  return useApi({
    key: `project-${id}`,
    queryFn: () => api.projects.getById(id),
    enabled,
  });
}

export function useTasks(projectId?: string, enabled = true) {
  return useApi({
    key: `tasks${projectId ? `-${projectId}` : ''}`,
    queryFn: () => api.tasks.getAll({ projectId }),
    enabled,
  });
}

export function useTask(id: string, enabled = true) {
  return useApi({
    key: `task-${id}`,
    queryFn: () => api.tasks.getById(id),
    enabled,
  });
}

export function useTeams(enabled = true) {
  return useApi({
    key: 'teams',
    queryFn: () => api.teams.getAll(),
    enabled,
  });
}

export function useTeam(id: string, enabled = true) {
  return useApi({
    key: `team-${id}`,
    queryFn: () => api.teams.getById(id),
    enabled,
  });
}

export function useResources(projectId?: string, enabled = true) {
  return useApi({
    key: `resources${projectId ? `-${projectId}` : ''}`,
    queryFn: () => api.resources.getAll({ projectId }),
    enabled,
  });
}

export function useResource(id: string, enabled = true) {
  return useApi({
    key: `resource-${id}`,
    queryFn: () => api.resources.getById(id),
    enabled,
  });
}

// Mutation hooks
export function useCreateProject() {
  return useApiMutation({
    mutationFn: (data: { title: string; description: string }) =>
      api.projects.create(data),
    invalidateQueries: ['projects'],
  });
}

export function useUpdateProject() {
  return useApiMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ title: string; description: string }>;
    }) => api.projects.update(id, data),
    invalidateQueries: ['projects'],
  });
}

export function useDeleteProject() {
  return useApiMutation({
    mutationFn: (id: string) => api.projects.delete(id),
    invalidateQueries: ['projects'],
  });
}

export function useCreateTask() {
  return useApiMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      projectId: string;
    }) => api.tasks.create(data),
    invalidateQueries: ['tasks'],
  });
}

export function useUpdateTask() {
  return useApiMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ title: string; description: string; status: string }>;
    }) => api.tasks.update(id, data),
    invalidateQueries: ['tasks'],
  });
}

export function useDeleteTask() {
  return useApiMutation({
    mutationFn: (id: string) => api.tasks.delete(id),
    invalidateQueries: ['tasks'],
  });
}

export function useUploadResource() {
  return useApiMutation({
    mutationFn: ({ file, projectId }: { file: File; projectId: string }) =>
      api.resources.upload(file, projectId),
    invalidateQueries: ['resources'],
  });
}

export function useDeleteResource() {
  return useApiMutation({
    mutationFn: (id: string) => api.resources.delete(id),
    invalidateQueries: ['resources'],
  });
} 