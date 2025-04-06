import { vi } from 'vitest';

// Mock data generators
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateEmail(): string {
  return `test-${generateId()}@example.com`;
}

export function generateName(): string {
  const firstNames = [
    'John',
    'Jane',
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Edward',
    'Fiona',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

export function generateDate(
  start: Date = new Date(2020, 0, 1),
  end: Date = new Date()
): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Mock data factories
export function createMockUser(overrides = {}) {
  return {
    id: generateId(),
    name: generateName(),
    email: generateEmail(),
    avatar: `https://i.pravatar.cc/150?u=${generateId()}`,
    role: 'member',
    createdAt: generateDate(),
    updatedAt: generateDate(),
    ...overrides,
  };
}

export function createMockProject(overrides = {}) {
  return {
    id: generateId(),
    title: `Project ${generateId()}`,
    description: 'A test project description',
    status: 'active',
    priority: 'medium',
    startDate: generateDate(),
    endDate: generateDate(new Date(), new Date(2025, 0, 1)),
    progress: Math.floor(Math.random() * 100),
    assignedPeople: Array(3)
      .fill(null)
      .map(() => createMockUser()),
    tasks: Array(5)
      .fill(null)
      .map(() => createMockTask()),
    resources: Array(2)
      .fill(null)
      .map(() => createMockResource()),
    createdAt: generateDate(),
    updatedAt: generateDate(),
    ...overrides,
  };
}

export function createMockTask(overrides = {}) {
  return {
    id: generateId(),
    title: `Task ${generateId()}`,
    description: 'A test task description',
    status: 'todo',
    priority: 'medium',
    projectId: generateId(),
    assignees: Array(2)
      .fill(null)
      .map(() => createMockUser()),
    dueDate: generateDate(new Date(), new Date(2025, 0, 1)),
    estimatedHours: Math.floor(Math.random() * 40),
    completedAt: null,
    createdAt: generateDate(),
    updatedAt: generateDate(),
    ...overrides,
  };
}

export function createMockResource(overrides = {}) {
  return {
    id: generateId(),
    name: `Resource ${generateId()}`,
    type: 'file',
    category: 'development',
    format: 'pdf',
    url: `https://example.com/files/${generateId()}.pdf`,
    size: Math.floor(Math.random() * 1000000),
    projectId: generateId(),
    teamId: generateId(),
    createdBy: createMockUser(),
    createdAt: generateDate(),
    updatedAt: generateDate(),
    ...overrides,
  };
}

// Mock API responses
export function createMockApiResponse<T>(data: T) {
  return {
    data,
    status: 200,
    message: 'Success',
  };
}

export function createMockPaginatedResponse<T>(
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

export function createMockApiError(
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

// Mock functions and timers
export function mockConsole() {
  const consoleMock = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  };

  const originalConsole = { ...console };

  beforeEach(() => {
    global.console = { ...console, ...consoleMock };
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  return consoleMock;
}

export function mockDate(date: Date = new Date(2023, 0, 1)) {
  const RealDate = Date;
  const mockDate = vi.fn(() => date);
  mockDate.UTC = RealDate.UTC;
  mockDate.parse = RealDate.parse;
  mockDate.now = vi.fn(() => date.getTime());

  beforeEach(() => {
    global.Date = mockDate as unknown as typeof Date;
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  return mockDate;
}

export function mockLocalStorage() {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    global.localStorage = localStorageMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  return localStorageMock;
}

// Test utilities
export function waitFor(
  callback: () => void | Promise<void>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 1000, interval = 50 } = options;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = async () => {
      try {
        await callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, interval);
        }
      }
    };

    check();
  });
}

export function createEvent(type: string, props = {}) {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, props);
  return event;
}

export function createChangeEvent(value: string) {
  return {
    target: { value },
    currentTarget: { value },
  };
}

export function createSubmitEvent() {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  };
} 