'use client'
import React, { useState, useEffect } from 'react';
import BacklogGrid from './BacklogGrid';
import { WorkItem } from './WorkItemRow';
import BacklogHeader from './BacklogHeader';
import WorkItemModal from './WorkItemModal';
import { Toaster, toast } from 'sonner'
import { getWorkItems } from '@/app/_server/backlog';
// import { useToast } from '@/_components/hook/use_toast';
// import { ToastAction } from '@/_components/common/toast';

const BacklogPage = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [isNewWorkItemModalOpen, setIsNewWorkItemModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('edit');
  const [editWorkItem, setEditWorkItem] = useState<{
    id: number;
    title: string;
    description: string;
    type: string;
    parentId: number;
  } | null>(null);
  const [parentWorkItem, setParentWorkItem] = useState<{
    id: number;
    type: 'Epic' | 'Feature' | 'User Story';
    title: string;
  } | null>(null);

  // Fetch work items from database on component mount
  useEffect(() => {
    const fetchWorkItems = async () => {
      try {
        setLoading(true);
        const items = await getWorkItems();
        setWorkItems(items);
      } catch (error) {
        console.error('Error fetching work items:', error);
        toast.error('Failed to load work items');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkItems();
  }, []);

  // Refresh work items after creating a new one
  const refreshWorkItems = async () => {
    try {
      const items = await getWorkItems();
      setWorkItems(items);
    } catch (error) {
      console.error('Error refreshing work items:', error);
    }
  };

  // Handle view work item (opens in preview mode)
  const handleView = (item: WorkItem) => {
    setModalMode('view');
    setEditWorkItem({
      id: parseInt(item.id),
      title: item.title,
      description: item.description || '',
      type: item.type,
      parentId: item.parentId || 0,
    });
    setIsNewWorkItemModalOpen(true);
  };

  // Handle edit work item (opens in edit mode)
  const handleEdit = (item: WorkItem) => {
    setModalMode('edit');
    setEditWorkItem({
      id: parseInt(item.id),
      title: item.title,
      description: item.description || '',
      type: item.type,
      parentId: item.parentId || 0,
    });
    setIsNewWorkItemModalOpen(true);
  };

  // Handle add child work item
  const handleAddChild = (parentItem: WorkItem) => {
    setModalMode('edit');
    setParentWorkItem({
      id: parseInt(parentItem.id),
      type: parentItem.type,
      title: parentItem.title,
    });
    setIsNewWorkItemModalOpen(true);
  };

  // Handle new work item from header
  const handleNewWorkItem = () => {
    setModalMode('edit');
    setIsNewWorkItemModalOpen(true);
  };

  const toggleExpand = (id: string, items: WorkItem[] = workItems): WorkItem[] => {
    return items.map(item => {
      if (item.id === id) {
        return { ...item, expanded: !item.expanded };
      }
      if (item.children) {
        return { ...item, children: toggleExpand(id, item.children) };
      }
      return item;
    });
  };

  const handleToggleExpand = (id: string) => {
    setWorkItems(toggleExpand(id));
  };

  const expandAll = () => {
    const expandItems = (items: WorkItem[]): WorkItem[] => {
      return items.map(item => ({
        ...item,
        expanded: true,
        children: item.children ? expandItems(item.children) : item.children
      }));
    };
    setWorkItems(expandItems(workItems));
  };

  const collapseAll = () => {
    const collapseItems = (items: WorkItem[]): WorkItem[] => {
      return items.map(item => ({
        ...item,
        expanded: false,
        children: item.children ? collapseItems(item.children) : item.children
      }));
    };
    setWorkItems(collapseItems(workItems));
  };

  // const { toast } = useToast();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white text-sm">Loading work items...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <BacklogHeader
        onNewWorkItem={handleNewWorkItem}
      />
      {/* <button onClick={() => {
        console.log("clicked");
        toast({ title: "Hello", description: "Hello", action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction> })
      }}>Click me</button> */}

      {/* <button onClick={() => toast.success('Event has been created')}>
        Give me a toast
      </button> */}

      <div className="p-6">
        <BacklogGrid
          workItems={workItems}
          onToggleExpand={handleToggleExpand}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onView={handleView}
          onEdit={handleEdit}
          onAddChild={handleAddChild}
        />
      </div>
      <WorkItemModal
        type="Epic"
        mode={modalMode}
        isOpen={isNewWorkItemModalOpen}
        editWorkItem={editWorkItem}
        parentWorkItem={parentWorkItem}
        onClose={() => {
          setIsNewWorkItemModalOpen(false);
          setEditWorkItem(null); // Clear edit data
          setParentWorkItem(null); // Clear parent data
          setModalMode('edit'); // Reset to edit mode
          refreshWorkItems(); // Refresh data after closing modal
        }}
      />
    </div>
  );
};

export default BacklogPage;
