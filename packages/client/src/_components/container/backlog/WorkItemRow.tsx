
import React from 'react';
import { Button } from '@/_components/common/button';
import { Plus, ChevronRight, ChevronDown, Crown } from 'lucide-react';

export interface WorkItem {
  id: string;
  order: number;
  type: 'Epic' | 'Feature' | 'User Story';
  title: string;
  state: 'New' | 'In Progress' | 'Done';
  effort?: number;
  businessValue?: string;
  valueArea: string;
  tags: string[];
  children?: WorkItem[];
  expanded?: boolean;
}

interface WorkItemRowProps {
  item: WorkItem;
  level: number;
  onToggleExpand: (id: string) => void;
}

const WorkItemRow = ({ item, level, onToggleExpand }: WorkItemRowProps) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = item.expanded && hasChildren;

  const getWorkItemIcon = (type: string) => {
    switch (type) {
      case 'Epic':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Feature':
        return <div className="w-4 h-4 bg-purple-500 rounded-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-sm"></div>
        </div>;
      case 'User Story':
        return <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-sm"></div>
        </div>;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div 
        className="grid grid-cols-12 gap-4 py-2 px-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 items-center group cursor-cell"
        style={{ paddingLeft: `${16 + level * 24}px` }}
      >
        {/* Add button */}
        <div className="col-span-1 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Order - only show for Epic type */}
        <div className="col-span-1 text-[10px] text-gray-400 text-right">
          {item.type === 'Epic' ? item.order : ''}
        </div>
        
        {/* Work Item Type */}
        <div className="col-span-2 flex items-center gap-2">
          {hasChildren && (
            <button
              onClick={() => onToggleExpand(item.id)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5"></div>}
          {getWorkItemIcon(item.type)}
          <span className="text-[10px] text-gray-300">{item.type}</span>
        </div>
        
        {/* Title */}
        <div className="col-span-3 text-[10px] text-white">
          {item.title}
        </div>
        
        {/* State */}
        <div className="col-span-1 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-[10px] text-gray-300">{item.state}</span>
        </div>
        
        {/* Effort */}
        {/* <div className="col-span-1 text-[10px] text-gray-400">
          {item.effort || ''}
        </div> */}
        
        {/* Business Value */}
        {/* <div className="col-span-1 text-[10px] text-gray-400">
          {item.businessValue || ''}
        </div> */}
        
        {/* Value Area */}
        <div className="col-span-1 text-[10px] text-gray-300">
          {item.valueArea}
        </div>
        
        {/* Tags */}
        <div className="col-span-1 text-[10px] text-gray-400">
          {item.tags.join(', ')}
        </div>
      </div>
      
      {isExpanded && item.children?.map(child => (
        <WorkItemRow 
          key={child.id} 
          item={child} 
          level={level + 1} 
          onToggleExpand={onToggleExpand} 
        />
      ))}
    </React.Fragment>
  );
};

export default WorkItemRow;
