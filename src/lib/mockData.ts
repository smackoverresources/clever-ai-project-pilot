import { Project, Task, ProjectMetrics, Person, Team, Resource } from './types';

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'active',
    teamId: 'team-1',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    assignedPeople: ['person-1', 'person-2', 'person-4', 'person-5'],
    tasks: ['task-1', 'task-2', 'task-3', 'task-5', 'task-6']
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Development of new mobile application',
    status: 'active',
    teamId: 'team-1',
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    assignedPeople: ['person-1', 'person-3'],
    tasks: ['task-4']
  },
  {
    id: 'project-3',
    name: 'Marketing Campaign',
    description: 'Q2 2024 Marketing Campaign',
    status: 'on-hold',
    teamId: 'team-3',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    assignedPeople: ['person-6', 'person-7'],
    tasks: []
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Design System Setup',
    description: 'Create and document design system components',
    status: 'in-progress',
    priority: 'high',
    assignees: ['person-1'],
    dueDate: '2024-02-15',
    estimatedHours: 40,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    comments: [
      {
        id: 'comment-1',
        taskId: 'task-1',
        authorId: 'person-1',
        content: 'Started working on the component library',
        createdAt: '2024-01-02'
      }
    ]
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Homepage Implementation',
    description: 'Implement new homepage design',
    status: 'todo',
    priority: 'medium',
    assignees: ['person-1', 'person-2'],
    dueDate: '2024-03-01',
    estimatedHours: 60,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: 'Responsive Testing',
    description: 'Test website across different devices and screen sizes',
    status: 'todo',
    priority: 'medium',
    assignees: ['person-2'],
    dueDate: '2024-03-15',
    estimatedHours: 20,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: 'task-4',
    projectId: 'project-2',
    title: 'API Development',
    description: 'Develop backend APIs for mobile app',
    status: 'todo',
    priority: 'high',
    assignees: ['person-3'],
    dueDate: '2024-03-31',
    estimatedHours: 80,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: 'task-5',
    projectId: 'project-1',
    title: 'UI Design',
    description: 'Create UI designs for all pages',
    status: 'in-progress',
    priority: 'high',
    assignees: ['person-4'],
    dueDate: '2024-02-28',
    estimatedHours: 50,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  },
  {
    id: 'task-6',
    projectId: 'project-1',
    title: 'User Testing',
    description: 'Conduct user testing sessions',
    status: 'todo',
    priority: 'low',
    assignees: ['person-5'],
    dueDate: '2024-04-15',
    estimatedHours: 30,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02'
  }
];

export const mockMetrics: ProjectMetrics = {
  totalTasks: 3,
  completedTasks: 1,
  overdueTasks: 0,
  budgetUtilization: 0.3,
  timelineProgress: 0.2,
  teamUtilization: 0.75,
};

export const mockAIResponses = [
  {
    type: 'suggestion',
    content: 'Consider breaking down the UI Components task into smaller subtasks for better tracking',
    timestamp: '2024-03-15T10:30:00Z',
    context: {
      taskId: '2',
    },
  },
  {
    type: 'advice',
    content: 'The project is currently on track with budget and timeline',
    timestamp: '2024-03-15T11:00:00Z',
    context: {
      projectId: '1',
    },
  },
];

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Development Team',
    description: 'Core development team responsible for product development',
    members: ['person-1', 'person-2', 'person-3'],
    projects: ['project-1', 'project-2']
  },
  {
    id: 'team-2',
    name: 'Design Team',
    description: 'UI/UX design team',
    members: ['person-4', 'person-5'],
    projects: ['project-1']
  },
  {
    id: 'team-3',
    name: 'Marketing Team',
    description: 'Marketing and communications team',
    members: ['person-6', 'person-7'],
    projects: ['project-3']
  }
];

export const mockPeople: Person[] = [
  {
    id: 'person-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Senior Developer',
    teamId: 'team-1',
    status: 'active',
    joinedDate: '2023-01-15',
    avatar: '/avatars/john-doe.jpg',
    type: 'in-house',
    assignedProjects: ['project-1', 'project-2'],
    assignedTasks: ['task-1', 'task-2']
  },
  {
    id: 'person-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Frontend Developer',
    teamId: 'team-1',
    status: 'active',
    joinedDate: '2023-02-01',
    avatar: '/avatars/jane-smith.jpg',
    type: 'in-house',
    assignedProjects: ['project-1'],
    assignedTasks: ['task-3']
  },
  {
    id: 'person-3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Backend Developer',
    teamId: 'team-1',
    status: 'active',
    joinedDate: '2023-03-15',
    avatar: '/avatars/bob-johnson.jpg',
    type: 'in-house',
    assignedProjects: ['project-2'],
    assignedTasks: ['task-4']
  },
  {
    id: 'person-4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'UI Designer',
    teamId: 'team-2',
    status: 'active',
    joinedDate: '2023-02-15',
    avatar: '/avatars/alice-brown.jpg',
    type: 'in-house',
    assignedProjects: ['project-1'],
    assignedTasks: ['task-5']
  },
  {
    id: 'person-5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'UX Designer',
    teamId: 'team-2',
    status: 'active',
    joinedDate: '2023-04-01',
    avatar: '/avatars/charlie-wilson.jpg',
    type: 'in-house',
    assignedProjects: ['project-1'],
    assignedTasks: ['task-6']
  }
];

export const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Project Requirements Document',
    type: 'document',
    description: 'Detailed requirements specification for the website redesign project',
    url: '/documents/requirements.pdf',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    size: 2048576, // 2MB
    format: 'pdf',
    category: 'Requirements',
    tags: ['documentation', 'requirements', 'specification'],
    createdBy: '1', // John Doe
    projectId: 'project-1'
  },
  {
    id: '2',
    name: 'Design System Guidelines',
    type: 'document',
    description: 'Company design system documentation and guidelines',
    url: '/documents/design-system.pdf',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
    size: 5242880, // 5MB
    format: 'pdf',
    category: 'Design',
    tags: ['design', 'guidelines', 'branding'],
    createdBy: '2', // Jane Smith
    projectId: 'project-1'
  },
  {
    id: '3',
    name: 'Project Proposal Template',
    type: 'template',
    description: 'Standard template for creating project proposals',
    url: '/templates/project-proposal.docx',
    createdAt: '2024-02-10T11:20:00Z',
    updatedAt: '2024-02-10T11:20:00Z',
    size: 1048576, // 1MB
    format: 'docx',
    category: 'Templates',
    tags: ['template', 'proposal', 'project'],
    createdBy: '3', // Bob Johnson
    projectId: 'project-2'
  },
  {
    id: '4',
    name: 'API Documentation',
    type: 'document',
    description: 'Technical documentation for the REST API',
    url: '/documents/api-docs.md',
    createdAt: '2024-02-15T16:45:00Z',
    updatedAt: '2024-03-01T13:20:00Z',
    size: 512000, // 500KB
    format: 'md',
    category: 'Technical',
    tags: ['api', 'documentation', 'technical'],
    createdBy: '1', // John Doe
    projectId: 'project-2'
  },
  {
    id: '5',
    name: 'Meeting Minutes Template',
    type: 'template',
    description: 'Standard template for recording meeting minutes',
    url: '/templates/meeting-minutes.docx',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-20T09:00:00Z',
    size: 524288, // 512KB
    format: 'docx',
    category: 'Templates',
    tags: ['template', 'meetings', 'documentation'],
    createdBy: '2', // Jane Smith
    projectId: 'project-3'
  },
]; 