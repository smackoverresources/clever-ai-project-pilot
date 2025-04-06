import { Message } from '@/types/assistant';

interface ProjectCreationData {
  name: string;
  description: string;
  objectives: string[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: Array<{
      title: string;
      date: Date;
      description: string;
    }>;
  };
  team: Array<{
    role: string;
    skills: string[];
    responsibilities: string[];
  }>;
  tasks: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    assignee?: string;
    dueDate?: Date;
  }>;
  resources: Array<{
    type: string;
    name: string;
    description: string;
    link?: string;
  }>;
}

interface AIResponse {
  content: string;
  action?: {
    type: 'create_project' | 'update_project' | 'create_task' | 'update_task' | 'create_team' | 'update_team';
    data: any;
  };
  context?: {
    type: 'file' | 'project' | 'task';
    name: string;
    path?: string;
  };
}

class AIService {
  private static instance: AIService;
  private projectContext: Partial<ProjectCreationData> = {};
  private currentStep: string = '';

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async callAI(prompt: string): Promise<AIResponse> {
    // This would be replaced with actual AI model call
    // For now, we'll simulate responses based on context
    if (prompt.toLowerCase().includes('create new project')) {
      this.currentStep = 'project_name';
      return {
        content: "I'll help you create a new project. First, what would you like to name your project?",
        context: {
          type: 'project',
          name: 'Project Creation',
        },
      };
    }

    switch (this.currentStep) {
      case 'project_name':
        this.projectContext.name = prompt;
        this.currentStep = 'project_description';
        return {
          content: `Great! The project will be called "${prompt}". Now, please provide a brief description of the project's goals and scope.`,
          context: {
            type: 'project',
            name: prompt,
          },
        };

      case 'project_description':
        this.projectContext.description = prompt;
        this.currentStep = 'project_timeline';
        return {
          content: "Thank you. Let's define the project timeline. When would you like the project to start and end? (Please provide dates in MM/DD/YYYY format)",
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      case 'project_timeline':
        // Parse dates and set timeline
        this.currentStep = 'team_composition';
        return {
          content: "Now, let's define the team composition. What roles do you need for this project? (List each role and required skills)",
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      case 'team_composition':
        // Parse team requirements
        this.currentStep = 'initial_tasks';
        return {
          content: "Great! Let's break down the initial tasks for the project. What are the main tasks we should start with?",
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      case 'initial_tasks':
        // Parse tasks
        this.currentStep = 'project_creation';
        return {
          content: "I'll create the project with all the information provided. Here's a summary of what we'll set up:",
          action: {
            type: 'create_project',
            data: this.projectContext,
          },
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      default:
        // Handle general project management queries
        return {
          content: "I'm here to help manage your project. You can ask me about tasks, timelines, team members, or start creating a new project.",
          context: {
            type: 'project',
            name: 'Project Management',
          },
        };
    }
  }

  async processMessage(message: string): Promise<AIResponse> {
    try {
      return await this.callAI(message);
    } catch (error) {
      console.error('Error processing AI message:', error);
      return {
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        context: {
          type: 'project',
          name: 'Error',
        },
      };
    }
  }

  async createProject(data: ProjectCreationData): Promise<void> {
    // Implement project creation logic
    console.log('Creating project:', data);
    // This would integrate with your project management system
  }

  async updateProject(projectId: string, data: Partial<ProjectCreationData>): Promise<void> {
    // Implement project update logic
    console.log('Updating project:', projectId, data);
  }

  async createTask(projectId: string, taskData: any): Promise<void> {
    // Implement task creation logic
    console.log('Creating task for project:', projectId, taskData);
  }

  resetContext(): void {
    this.projectContext = {};
    this.currentStep = '';
  }
}

export const aiService = AIService.getInstance(); 

interface ProjectCreationData {
  name: string;
  description: string;
  objectives: string[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: Array<{
      title: string;
      date: Date;
      description: string;
    }>;
  };
  team: Array<{
    role: string;
    skills: string[];
    responsibilities: string[];
  }>;
  tasks: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    assignee?: string;
    dueDate?: Date;
  }>;
  resources: Array<{
    type: string;
    name: string;
    description: string;
    link?: string;
  }>;
}

interface AIResponse {
  content: string;
  action?: {
    type: 'create_project' | 'update_project' | 'create_task' | 'update_task' | 'create_team' | 'update_team';
    data: any;
  };
  context?: {
    type: 'file' | 'project' | 'task';
    name: string;
    path?: string;
  };
}

class AIService {
  private static instance: AIService;
  private projectContext: Partial<ProjectCreationData> = {};
  private currentStep: string = '';

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async callAI(prompt: string): Promise<AIResponse> {
    // This would be replaced with actual AI model call
    // For now, we'll simulate responses based on context
    if (prompt.toLowerCase().includes('create new project')) {
      this.currentStep = 'project_name';
      return {
        content: "I'll help you create a new project. First, what would you like to name your project?",
        context: {
          type: 'project',
          name: 'Project Creation',
        },
      };
    }

    switch (this.currentStep) {
      case 'project_name':
        this.projectContext.name = prompt;
        this.currentStep = 'project_description';
        return {
          content: `Great! The project will be called "${prompt}". Now, please provide a brief description of the project's goals and scope.`,
          context: {
            type: 'project',
            name: prompt,
          },
        };

      case 'project_description':
        this.projectContext.description = prompt;
        this.currentStep = 'project_timeline';
        return {
          content: "Thank you. Let's define the project timeline. When would you like the project to start and end? (Please provide dates in MM/DD/YYYY format)",
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      case 'project_timeline':
        // Parse dates and set timeline
        this.currentStep = 'team_composition';
        return {
          content: "Now, let's define the team composition. What roles do you need for this project? (List each role and required skills)",
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      case 'team_composition':
        // Parse team requirements
        this.currentStep = 'initial_tasks';
        return {
          content: "Great! Let's break down the initial tasks for the project. What are the main tasks we should start with?",
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      case 'initial_tasks':
        // Parse tasks
        this.currentStep = 'project_creation';
        return {
          content: "I'll create the project with all the information provided. Here's a summary of what we'll set up:",
          action: {
            type: 'create_project',
            data: this.projectContext,
          },
          context: {
            type: 'project',
            name: this.projectContext.name || '',
          },
        };

      default:
        // Handle general project management queries
        return {
          content: "I'm here to help manage your project. You can ask me about tasks, timelines, team members, or start creating a new project.",
          context: {
            type: 'project',
            name: 'Project Management',
          },
        };
    }
  }

  async processMessage(message: string): Promise<AIResponse> {
    try {
      return await this.callAI(message);
    } catch (error) {
      console.error('Error processing AI message:', error);
      return {
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        context: {
          type: 'project',
          name: 'Error',
        },
      };
    }
  }

  async createProject(data: ProjectCreationData): Promise<void> {
    // Implement project creation logic
    console.log('Creating project:', data);
    // This would integrate with your project management system
  }

  async updateProject(projectId: string, data: Partial<ProjectCreationData>): Promise<void> {
    // Implement project update logic
    console.log('Updating project:', projectId, data);
  }

  async createTask(projectId: string, taskData: any): Promise<void> {
    // Implement task creation logic
    console.log('Creating task for project:', projectId, taskData);
  }

  resetContext(): void {
    this.projectContext = {};
    this.currentStep = '';
  }
}

export const aiService = AIService.getInstance(); 