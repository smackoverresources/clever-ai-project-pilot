import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@/lib/providers/AppProvider';

// Create a custom render function that includes providers
function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    ...rtlRender(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppProvider>{ui}</AppProvider>
        </BrowserRouter>
      </QueryClientProvider>
    ),
    queryClient,
  };
}

// Create a wrapper for testing hooks
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppProvider>{children}</AppProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  };
}

// Mock API response
function mockApiResponse<T>(data: T) {
  return {
    data,
    status: 200,
    message: 'Success',
  };
}

// Mock paginated API response
function mockPaginatedResponse<T>(
  data: T[],
  page = 1,
  limit = 10,
  total = 100
) {
  return {
    data,
    status: 200,
    message: 'Success',
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}

// Mock API error
function mockApiError(
  status = 500,
  message = 'Internal Server Error',
  errors?: Record<string, string[]>
) {
  return {
    status,
    message,
    errors,
  };
}

// Mock form submission event
function mockFormEvent() {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  };
}

// Mock change event
function mockChangeEvent(value: string) {
  return {
    target: { value },
    currentTarget: { value },
  };
}

// Mock file event
function mockFileEvent(files: File[]) {
  return {
    target: {
      files,
      value: files.map((f) => f.name).join(','),
    },
  };
}

// Create a mock file
function createMockFile(
  name: string,
  type = 'application/pdf',
  size = 1024
) {
  return new File(['mock content'], name, { type });
}

// Wait for promises to resolve
async function waitForPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// Mock local storage
function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => {
        delete store[key];
      });
    }),
  };
}

// Mock window.fetch
function mockFetch(response: any) {
  return vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(response),
    } as Response)
  );
}

// Mock window.fetch with error
function mockFetchError(error: any) {
  return vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.reject(error)
  );
}

export {
  render,
  createWrapper,
  mockApiResponse,
  mockPaginatedResponse,
  mockApiError,
  mockFormEvent,
  mockChangeEvent,
  mockFileEvent,
  createMockFile,
  waitForPromises,
  mockLocalStorage,
  mockFetch,
  mockFetchError,
}; 