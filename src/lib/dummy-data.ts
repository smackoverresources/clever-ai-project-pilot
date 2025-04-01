
import { Calendar, KanbanSquare, List } from "lucide-react";

export type ProjectStatus = "Not Started" | "In Progress" | "Completed" | "On Hold";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done" | "Blocked";
  dueDate: string;
  assignee?: string;
  priority: "Low" | "Medium" | "High";
  estimatedHours?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget?: number;
  tasks: Task[];
  team?: string[];
  laborRate?: number;
}

export const VIEW_TYPES = [
  {
    id: "kanban",
    name: "Kanban",
    icon: KanbanSquare,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
  },
  {
    id: "list",
    name: "List",
    icon: List,
  },
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Complete overhaul of company website with new branding",
    status: "In Progress",
    startDate: "2023-11-01",
    endDate: "2023-12-15",
    budget: 5000,
    laborRate: 85,
    tasks: [
      {
        id: "t1",
        title: "Create wireframes",
        description: "Design initial wireframes for homepage and key pages",
        status: "Done",
        dueDate: "2023-11-10",
        assignee: "Alex Kim",
        priority: "High",
        estimatedHours: 10,
      },
      {
        id: "t2",
        title: "Develop homepage",
        description: "Code the homepage based on approved designs",
        status: "In Progress",
        dueDate: "2023-11-25",
        assignee: "Jordan Smith",
        priority: "High",
        estimatedHours: 20,
      },
      {
        id: "t3",
        title: "Content migration",
        description: "Move content from old site to new platform",
        status: "To Do",
        dueDate: "2023-12-05",
        assignee: "Taylor Johnson",
        priority: "Medium",
        estimatedHours: 15,
      },
      {
        id: "t4",
        title: "SEO optimization",
        description: "Implement SEO best practices across the site",
        status: "To Do",
        dueDate: "2023-12-10",
        assignee: "Alex Kim",
        priority: "Medium",
        estimatedHours: 8,
      },
    ],
    team: ["Alex Kim", "Jordan Smith", "Taylor Johnson"],
  },
  {
    id: "2",
    title: "Product Launch Campaign",
    description: "Marketing campaign for new product line",
    status: "Not Started",
    startDate: "2023-12-01",
    endDate: "2024-01-31",
    budget: 12000,
    laborRate: 95,
    tasks: [
      {
        id: "t5",
        title: "Market research",
        description: "Analyze target audience and competition",
        status: "To Do",
        dueDate: "2023-12-15",
        assignee: "Morgan Lee",
        priority: "High",
        estimatedHours: 25,
      },
      {
        id: "t6",
        title: "Social media strategy",
        description: "Develop campaign strategy for social platforms",
        status: "To Do",
        dueDate: "2023-12-20",
        assignee: "Riley Garcia",
        priority: "High",
        estimatedHours: 12,
      },
      {
        id: "t7",
        title: "Design campaign assets",
        description: "Create graphics and videos for campaign",
        status: "To Do",
        dueDate: "2024-01-10",
        assignee: "Jamie Wong",
        priority: "Medium",
        estimatedHours: 30,
      },
    ],
    team: ["Morgan Lee", "Riley Garcia", "Jamie Wong"],
  },
  {
    id: "3",
    title: "Office Relocation",
    description: "Coordinate move to new office space",
    status: "On Hold",
    startDate: "2024-02-01",
    endDate: "2024-03-15",
    budget: 20000,
    laborRate: 65,
    tasks: [
      {
        id: "t8",
        title: "Inventory current assets",
        description: "Create detailed inventory of furniture and equipment",
        status: "To Do",
        dueDate: "2024-02-10",
        assignee: "Casey Brown",
        priority: "Medium",
        estimatedHours: 8,
      },
      {
        id: "t9",
        title: "Select moving company",
        description: "Get quotes and select vendor",
        status: "To Do",
        dueDate: "2024-02-15",
        assignee: "Jordan Smith",
        priority: "High",
        estimatedHours: 5,
      },
      {
        id: "t10",
        title: "Network setup",
        description: "Configure network in new space",
        status: "To Do",
        dueDate: "2024-03-01",
        assignee: "Taylor Johnson",
        priority: "High",
        estimatedHours: 16,
      },
    ],
    team: ["Casey Brown", "Jordan Smith", "Taylor Johnson"],
  },
];
