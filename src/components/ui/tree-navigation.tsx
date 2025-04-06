import * as React from 'react';
import { ChevronRight, ChevronDown, Folder, Users, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  name: string;
  type: 'project' | 'person' | 'resource';
  children?: TreeNode[];
}

interface TreeNavigationProps {
  items: TreeNode[];
  onSelect: (item: TreeNode) => void;
  selectedId?: string;
}

export function TreeNavigation({ items, onSelect, selectedId }: TreeNavigationProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id}>
        <div
          className={cn(
            'flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-gray-100 rounded',
            isSelected && 'bg-blue-50 hover:bg-blue-100'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={(e) => {
            onSelect(node);
          }}
        >
          {hasChildren && (
            <span 
              className="w-4 h-4 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          {node.type === 'project' && <Folder className="w-4 h-4 text-blue-500" />}
          {node.type === 'person' && <Users className="w-4 h-4 text-green-500" />}
          {node.type === 'resource' && <Box className="w-4 h-4 text-orange-500" />}
          <span className="ml-1 text-sm">{node.name}</span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children?.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-auto">
      {items.map((item) => renderNode(item))}
    </div>
  );
} 