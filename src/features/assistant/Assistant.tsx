import React from 'react';
import { Bot, Send, Plus, Loader2, ChevronDown, X, Maximize2, Minimize2, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Message, Conversation } from '@/types/assistant';
import { aiService } from '@/services/ai-service';
import { useToast } from '@/components/ui/use-toast';

export default function Assistant() {
  const { toast } = useToast();
  const [conversations, setConversations] = React.useState<Conversation[]>([
    {
      id: 'default',
      title: 'New Conversation',
      lastMessage: new Date(),
      messages: [
        {
          id: 'welcome',
          content: "Hi! I'm your AI project manager. I can help you with:\n\n- Creating and managing projects\n- Planning project timelines and milestones\n- Assigning and tracking tasks\n- Team composition and resource allocation\n- Best practices and recommendations\n\nTo get started, you can say 'Create new project' or ask me about existing projects.",
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
    },
  ]);
  const [currentConversation, setCurrentConversation] = React.useState('default');
  const [input, setInput] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showContext, setShowContext] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const currentMessages = conversations.find(c => c.id === currentConversation)?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversation) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastMessage: new Date(),
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInput('');

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '...',
      role: 'assistant',
      timestamp: new Date(),
      status: 'loading',
    };

    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === currentConversation) {
          return {
            ...conv,
            messages: [...conv.messages, loadingMessage],
          };
        }
        return conv;
      })
    );

    try {
      // Process message with AI service
      const response = await aiService.processMessage(input);

      // Handle AI actions
      if (response.action) {
        switch (response.action.type) {
          case 'create_project':
            await aiService.createProject(response.action.data);
            toast({
              title: "Project Created",
              description: `Successfully created project: ${response.action.data.name}`,
            });
            break;
          case 'update_project':
            await aiService.updateProject(response.action.data.id, response.action.data);
            toast({
              title: "Project Updated",
              description: "Project details have been updated successfully.",
            });
            break;
          case 'create_task':
            await aiService.createTask(response.action.data.projectId, response.action.data);
            toast({
              title: "Task Created",
              description: `New task added: ${response.action.data.title}`,
            });
            break;
        }
      }

      const assistantMessage: Message = {
        id: loadingMessage.id,
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        status: 'success',
        context: response.context,
      };

      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === currentConversation) {
            return {
              ...conv,
              messages: [...conv.messages.filter(m => m.id !== loadingMessage.id), assistantMessage],
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: loadingMessage.id,
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
        status: 'error',
      };

      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === currentConversation) {
            return {
              ...conv,
              messages: [...conv.messages.filter(m => m.id !== loadingMessage.id), errorMessage],
            };
          }
          return conv;
        })
      );

      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewConversation = () => {
    aiService.resetContext();
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: new Date(),
      messages: [
        {
          id: 'welcome',
          content: "How can I help you with your project management today?",
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
    };

    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation.id);
  };

  return (
    <div className={cn(
      'flex h-full transition-all duration-200',
      isExpanded ? 'w-full' : 'w-full max-w-4xl mx-auto'
    )}>
      {/* Conversations Sidebar */}
      {showContext && (
        <div className="w-64 border-r bg-muted/30">
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleNewConversation}
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2 p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setCurrentConversation(conversation.id)}
                  className={cn(
                    'w-full rounded-lg p-3 text-left text-sm transition-colors hover:bg-accent',
                    conversation.id === currentConversation ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="flex-1 truncate">{conversation.title}</span>
                  </div>
                  <p className="mt-1 truncate text-xs opacity-50">
                    {conversation.messages[conversation.messages.length - 1]?.content}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h1 className="text-lg font-semibold">AI Project Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowContext(!showContext)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2">
                  {message.role === 'assistant' && <Bot className="h-4 w-4" />}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.status === 'loading' && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
                {message.context && (
                  <div className="flex items-center gap-2 rounded bg-background/50 px-2 py-1 text-xs">
                    <span className="opacity-50">Context:</span>
                    <span>{message.context.name}</span>
                  </div>
                )}
                <span className="text-xs opacity-50">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSend} className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about project management..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 
import { Bot, Send, Plus, Loader2, ChevronDown, X, Maximize2, Minimize2, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Message, Conversation } from '@/types/assistant';
import { aiService } from '@/services/ai-service';
import { useToast } from '@/components/ui/use-toast';

export default function Assistant() {
  const { toast } = useToast();
  const [conversations, setConversations] = React.useState<Conversation[]>([
    {
      id: 'default',
      title: 'New Conversation',
      lastMessage: new Date(),
      messages: [
        {
          id: 'welcome',
          content: "Hi! I'm your AI project manager. I can help you with:\n\n- Creating and managing projects\n- Planning project timelines and milestones\n- Assigning and tracking tasks\n- Team composition and resource allocation\n- Best practices and recommendations\n\nTo get started, you can say 'Create new project' or ask me about existing projects.",
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
    },
  ]);
  const [currentConversation, setCurrentConversation] = React.useState('default');
  const [input, setInput] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showContext, setShowContext] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const currentMessages = conversations.find(c => c.id === currentConversation)?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversation) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastMessage: new Date(),
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInput('');

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '...',
      role: 'assistant',
      timestamp: new Date(),
      status: 'loading',
    };

    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === currentConversation) {
          return {
            ...conv,
            messages: [...conv.messages, loadingMessage],
          };
        }
        return conv;
      })
    );

    try {
      // Process message with AI service
      const response = await aiService.processMessage(input);

      // Handle AI actions
      if (response.action) {
        switch (response.action.type) {
          case 'create_project':
            await aiService.createProject(response.action.data);
            toast({
              title: "Project Created",
              description: `Successfully created project: ${response.action.data.name}`,
            });
            break;
          case 'update_project':
            await aiService.updateProject(response.action.data.id, response.action.data);
            toast({
              title: "Project Updated",
              description: "Project details have been updated successfully.",
            });
            break;
          case 'create_task':
            await aiService.createTask(response.action.data.projectId, response.action.data);
            toast({
              title: "Task Created",
              description: `New task added: ${response.action.data.title}`,
            });
            break;
        }
      }

      const assistantMessage: Message = {
        id: loadingMessage.id,
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        status: 'success',
        context: response.context,
      };

      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === currentConversation) {
            return {
              ...conv,
              messages: [...conv.messages.filter(m => m.id !== loadingMessage.id), assistantMessage],
            };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: loadingMessage.id,
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
        status: 'error',
      };

      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === currentConversation) {
            return {
              ...conv,
              messages: [...conv.messages.filter(m => m.id !== loadingMessage.id), errorMessage],
            };
          }
          return conv;
        })
      );

      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewConversation = () => {
    aiService.resetContext();
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: new Date(),
      messages: [
        {
          id: 'welcome',
          content: "How can I help you with your project management today?",
          role: 'assistant',
          timestamp: new Date(),
        },
      ],
    };

    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation.id);
  };

  return (
    <div className={cn(
      'flex h-full transition-all duration-200',
      isExpanded ? 'w-full' : 'w-full max-w-4xl mx-auto'
    )}>
      {/* Conversations Sidebar */}
      {showContext && (
        <div className="w-64 border-r bg-muted/30">
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleNewConversation}
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2 p-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setCurrentConversation(conversation.id)}
                  className={cn(
                    'w-full rounded-lg p-3 text-left text-sm transition-colors hover:bg-accent',
                    conversation.id === currentConversation ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="flex-1 truncate">{conversation.title}</span>
                  </div>
                  <p className="mt-1 truncate text-xs opacity-50">
                    {conversation.messages[conversation.messages.length - 1]?.content}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h1 className="text-lg font-semibold">AI Project Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowContext(!showContext)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2">
                  {message.role === 'assistant' && <Bot className="h-4 w-4" />}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.status === 'loading' && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
                {message.context && (
                  <div className="flex items-center gap-2 rounded bg-background/50 px-2 py-1 text-xs">
                    <span className="opacity-50">Context:</span>
                    <span>{message.context.name}</span>
                  </div>
                )}
                <span className="text-xs opacity-50">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSend} className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about project management..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 