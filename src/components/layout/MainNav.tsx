import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { TreeNavigation } from '@/components/ui/tree-navigation';
import { TreeNode } from '@/components/ui/tree-navigation';
import { mockProjects } from '@/lib/mockData';
import { LayoutDashboard, ListTodo, Bot, Users, Settings as SettingsIcon, FolderKanban } from 'lucide-react';

// Mock data for tree navigation
const treeData: TreeNode[] = [
  {
    id: 'projects',
    name: 'Projects',
    type: 'project',
    children: mockProjects.map(project => ({
      id: project.id,
      name: project.name,
      type: 'project' as const,
      children: [
        {
          id: `${project.id}-tasks`,
          name: 'Tasks',
          type: 'project' as const,
        },
        {
          id: `${project.id}-team`,
          name: 'Team',
          type: 'person' as const,
        },
        {
          id: `${project.id}-resources`,
          name: 'Resources',
          type: 'resource' as const,
        }
      ]
    }))
  },
  {
    id: 'people',
    name: 'People',
    type: 'person',
    children: [
      {
        id: 'team-members',
        name: 'Team Members',
        type: 'person' as const,
      },
      {
        id: 'clients',
        name: 'Clients',
        type: 'person' as const,
      },
      {
        id: 'external-stakeholders',
        name: 'External Stakeholders',
        type: 'person' as const,
      }
    ]
  },
  {
    id: 'resources',
    name: 'Resources',
    type: 'resource',
    children: [
      {
        id: 'documents',
        name: 'Documents',
        type: 'resource' as const,
      },
      {
        id: 'templates',
        name: 'Templates',
        type: 'resource' as const,
      }
    ]
  }
];

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: ListTodo,
  },
  {
    name: 'People',
    href: '/people',
    icon: Users,
  },
  {
    name: 'AI Assistant',
    href: '/assistant',
    icon: Bot,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
];

export function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(null);

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
    
    // Handle navigation based on node type and id
    if (node.type === 'project') {
      if (node.id === 'projects') {
        navigate('/projects');
        return;
      }
      
      // Extract project ID for subsections
      let projectId = node.id;
      if (node.id.includes('-')) {
        projectId = node.id.split('-')[0];
      }

      // Handle project subsections
      if (node.id.endsWith('-tasks')) {
        navigate(`/tasks?projectId=${projectId}`);
      } else if (node.id.endsWith('-team')) {
        navigate(`/people?projectId=${projectId}&view=team`);
      } else if (node.id.endsWith('-resources')) {
        navigate(`/people?projectId=${projectId}&view=resources`);
      } else {
        // Handle clicking on a specific project
        navigate(`/projects?id=${projectId}`);
      }
    } else if (node.type === 'person') {
      if (node.id === 'people') {
        navigate('/people?type=all');
      } else if (node.id === 'team-members') {
        navigate('/people?type=team-members');
      } else if (node.id === 'clients') {
        navigate('/people?type=clients');
      } else if (node.id === 'external-stakeholders') {
        navigate('/people?type=external-stakeholders');
      }
    } else if (node.type === 'resource') {
      if (node.id === 'resources') {
        navigate('/resources?type=all');
      } else if (node.id === 'documents') {
        navigate('/resources?type=documents');
      } else if (node.id === 'templates') {
        navigate('/resources?type=templates');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h1 className="text-xl font-bold">Project Manager</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <TreeNavigation
          items={treeData}
          onSelect={handleNodeSelect}
          selectedId={selectedNode?.id}
        />
      </div>
      <div className="border-t border-border p-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                location.pathname === item.href && 'bg-accent text-accent-foreground'
              )}
              onClick={(e) => {
                if (item.name === 'People') {
                  e.preventDefault();
                  navigate('/people?type=all');
                } else if (item.name === 'Projects') {
                  e.preventDefault();
                  navigate('/projects');
                }
              }}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 