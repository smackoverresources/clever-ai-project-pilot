export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'loading' | 'error' | 'success';
  context?: {
    type: 'file' | 'project' | 'task';
    name: string;
    path?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: Date;
  messages: Message[];
} 
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'loading' | 'error' | 'success';
  context?: {
    type: 'file' | 'project' | 'task';
    name: string;
    path?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: Date;
  messages: Message[];
} 