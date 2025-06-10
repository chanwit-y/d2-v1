
import React from 'react';
import WorkItemRow, { WorkItem } from './WorkItemRow';
import BacklogGridToolbar from './BacklogGridToolbar';

interface BacklogGridProps {
  workItems: WorkItem[];
  onToggleExpand: (id: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const BacklogGrid = ({ workItems, onToggleExpand, onExpandAll, onCollapseAll }: BacklogGridProps) => {
  return (
    <>
      {/* Unified Toolbar */}
      <BacklogGridToolbar 
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
      />

      {/* Grid Header */}
      <div className="grid grid-cols-12 place-items-center gap-4 py-3 px-4 bg-[#252526] border-b border-gray-700 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <div className="col-span-1"></div>
        <div className="col-span-1">Order</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-3">Title</div>
        <div className="col-span-1">State</div>
        {/* <div className="col-span-1">Effort</div> */}
        {/* <div className="col-span-1">Business Value</div> */}
        <div className="col-span-1">Area</div>
        <div className="col-span-1">Tags</div>
      </div>

      {/* Grid Content */}
      <div className="bg-[#252526] border border-gray-700 rounded-b">
        {workItems.map(item => (
          <WorkItemRow 
            key={item.id} 
            item={item} 
            level={0} 
            onToggleExpand={onToggleExpand} 
          />
        ))}
      </div>
    </>
  );
};

export default BacklogGrid;
