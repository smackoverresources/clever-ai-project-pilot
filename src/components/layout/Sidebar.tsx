import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  Folder,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  FileBox,
  Settings,
  Bot
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  icon?: React.ElementType;
  children?: TreeNode[];
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  selectedNode: string | null;
  expandedNodes: Set<string>;
  onNodeSelect: (id: string) => void;
  onNodeToggle: (id: string) => void;
  navigate: (path: string) => void;
}

function TreeNode({
  node,
  level,
  selectedNode,
  expandedNodes,
  onNodeSelect,
  onNodeToggle,
  navigate,
}: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNode === node.id;
  const Icon = node.icon || (node.type === 'folder' ? Folder : File);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (node.type === 'folder') {
      onNodeToggle(node.id);
    } else {
      onNodeSelect(node.id);
      navigate(`/file/${node.id}`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
          isSelected && 'bg-accent text-accent-foreground',
          level > 0 && 'ml-4'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {node.type === 'folder' && (
          <button
            className="h-4 w-4 shrink-0 text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onNodeToggle(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        <Icon className="shrink-0 h-4 w-4 text-muted-foreground" />
        <span className="truncate">{node.name}</span>
      </div>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedNode={selectedNode}
              expandedNodes={expandedNodes}
              onNodeSelect={onNodeSelect}
              onNodeToggle={onNodeToggle}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleNodeSelect = (id: string) => {
    setSelectedNode(id);
  };

  const handleNodeToggle = (id: string) => {
    const newExpandedNodes = new Set(expandedNodes);
    if (newExpandedNodes.has(id)) {
      newExpandedNodes.delete(id);
    } else {
      newExpandedNodes.add(id);
    }
    setExpandedNodes(newExpandedNodes);
  };

  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: FolderKanban,
    },
    {
      title: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
    },
    {
      title: 'People',
      href: '/people',
      icon: Users,
    },
    {
      title: 'Teams',
      href: '/teams',
      icon: Users,
    },
    {
      title: 'Calendar',
      href: '/calendar',
      icon: Calendar,
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: FileBox,
    },
    {
      title: 'AI Assistant',
      href: '/assistant',
      icon: Bot,
    },
  ];

  const bottomNavItems = [
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const sidebarItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      type: 'folder' as const,
      children: [
        { id: 'overview', name: 'Overview', type: 'file' as const },
        { id: 'analytics', name: 'Analytics', type: 'file' as const },
      ],
    },
    {
      id: 'projects',
      name: 'Projects',
      type: 'folder' as const,
      children: [
        { id: 'active', name: 'Active Projects', type: 'file' as const },
        { id: 'archived', name: 'Archived Projects', type: 'file' as const },
      ],
    },
    {
      id: 'tasks',
      name: 'Tasks',
      type: 'folder' as const,
      children: [
        { id: 'my-tasks', name: 'My Tasks', type: 'file' as const },
        { id: 'team-tasks', name: 'Team Tasks', type: 'file' as const },
      ],
    },
    {
      id: 'calendar',
      name: 'Calendar',
      type: 'folder' as const,
      children: [
        { id: 'schedule', name: 'Schedule', type: 'file' as const },
        { id: 'meetings', name: 'Meetings', type: 'file' as const },
      ],
    },
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder' as const,
      children: [
        { id: 'shared', name: 'Shared Files', type: 'file' as const },
        { id: 'templates', name: 'Templates', type: 'file' as const },
      ],
    },
    {
      id: 'settings',
      name: 'Settings',
      type: 'folder' as const,
      children: [
        { id: 'profile', name: 'Profile', type: 'file' as const },
        { id: 'preferences', name: 'Preferences', type: 'file' as const },
      ],
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col fixed left-0 top-0 z-20 border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Button variant="outline" className="w-full justify-start">
          <ChevronDown className="mr-2 h-4 w-4" />
          Project Name
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  location.pathname === item.href 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>

          {/* File Explorer */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Explorer</span>
              </div>
            </div>
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <TreeNode
                  key={item.id}
                  node={item}
                  level={0}
                  selectedNode={selectedNode}
                  expandedNodes={expandedNodes}
                  onNodeSelect={handleNodeSelect}
                  onNodeToggle={handleNodeToggle}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <nav className="mt-auto pt-4 border-t space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  location.pathname === item.href 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}

export default Sidebar; 