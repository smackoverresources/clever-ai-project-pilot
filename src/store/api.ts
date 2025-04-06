import { create } from 'zustand';
import { ApiResponse, ApiError, PaginatedResponse } from '@/lib/types';

interface RequestState {
  isLoading: boolean;
  error: ApiError | null;
  timestamp: number;
}

interface Cache<T> {
  data: T;
  timestamp: number;
}

interface ApiState {
  requests: Record<string, RequestState>;
  cache: Record<string, Cache<any>>;
  cacheTimeout: number;

  // Request tracking
  startRequest: (key: string) => void;
  endRequest: (key: string, error?: ApiError) => void;
  clearRequest: (key: string) => void;
  clearAllRequests: () => void;

  // Cache management
  setCache: <T>(key: string, data: T) => void;
  getCache: <T>(key: string) => T | null;
  clearCache: (key: string) => void;
  clearAllCache: () => void;
  setCacheTimeout: (timeout: number) => void;

  // API helpers
  fetch: <T>(
    key: string,
    promise: Promise<T>,
    options?: {
      cache?: boolean;
      cacheTimeout?: number;
    }
  ) => Promise<T>;
}

const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export const useApiStore = create<ApiState>()((set, get) => ({
  requests: {},
  cache: {},
  cacheTimeout: CACHE_TIMEOUT,

  // Request tracking
  startRequest: (key) =>
    set((state) => ({
      requests: {
        ...state.requests,
        [key]: {
          isLoading: true,
          error: null,
          timestamp: Date.now(),
        },
      },
    })),

  endRequest: (key, error) =>
    set((state) => ({
      requests: {
        ...state.requests,
        [key]: {
          isLoading: false,
          error: error || null,
          timestamp: Date.now(),
        },
      },
    })),

  clearRequest: (key) =>
    set((state) => {
      const { [key]: _, ...requests } = state.requests;
      return { requests };
    }),

  clearAllRequests: () => set({ requests: {} }),

  // Cache management
  setCache: (key, data) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: {
          data,
          timestamp: Date.now(),
        },
      },
    })),

  getCache: (key) => {
    const state = get();
    const cached = state.cache[key];

    if (!cached) return null;

    const isExpired =
      Date.now() - cached.timestamp > state.cacheTimeout;
    
    if (isExpired) {
      state.clearCache(key);
      return null;
    }

    return cached.data;
  },

  clearCache: (key) =>
    set((state) => {
      const { [key]: _, ...cache } = state.cache;
      return { cache };
    }),

  clearAllCache: () => set({ cache: {} }),

  setCacheTimeout: (timeout) => set({ cacheTimeout: timeout }),

  // API helpers
  fetch: async (key, promise, options = {}) => {
    const state = get();
    const { cache = true, cacheTimeout } = options;

    // Check cache first
    if (cache) {
      const cached = state.getCache(key);
      if (cached) return cached;
    }

    // Set custom cache timeout if provided
    if (cacheTimeout) {
      state.setCacheTimeout(cacheTimeout);
    }

    try {
      state.startRequest(key);
      const data = await promise;

      // Cache successful response if caching is enabled
      if (cache) {
        state.setCache(key, data);
      }

      state.endRequest(key);
      return data;
    } catch (error) {
      const apiError: ApiError = {
        status: error.status || 500,
        message: error.message || 'An unexpected error occurred',
        errors: error.errors,
      };
      state.endRequest(key, apiError);
      throw apiError;
    }
  },
})); 