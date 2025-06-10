'use client'
import React, { useState } from 'react';
import BacklogGrid from './BacklogGrid';
import NewWorkItemModal from './NewWorkItemModal';
import { WorkItem } from './WorkItemRow';
import BacklogHeader from './BacklogHeader';
import WorkItemModal from './WorkItemModal';

const mockData: WorkItem[] = [
  {
    id: '1',
    order: 1,
    type: 'Epic',
    title: 'Common',
    state: 'New',
    valueArea: 'Business',
    tags: [],
    expanded: false,
    children: [
      {
        id: '1-1',
        order: 1,
        type: 'Feature',
        title: 'Ground Work',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: [
          {
            id: '1-1-1',
            order: 1,
            type: 'User Story',
            title: 'UI Prototype',
            state: 'New',
            valueArea: 'Business',
            tags: []
          },
          {
            id: '1-1-2',
            order: 2,
            type: 'User Story',
            title: 'POC',
            state: 'New',
            valueArea: 'Business',
            tags: []
          }
        ]
      },
      {
        id: '1-2',
        order: 2,
        type: 'Feature',
        title: 'Document',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: [
          {
            id: '1-2-1',
            order: 1,
            type: 'User Story',
            title: 'Database',
            state: 'New',
            valueArea: 'Business',
            tags: []
          },
          {
            id: '1-2-2',
            order: 2,
            type: 'User Story',
            title: 'Service Operation',
            state: 'New',
            valueArea: 'Business',
            tags: []
          }
        ]
      },
      {
        id: '1-3',
        order: 3,
        type: 'Feature',
        title: 'Development',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: [
          {
            id: '1-3-1',
            order: 1,
            type: 'User Story',
            title: 'Requirement',
            state: 'New',
            valueArea: 'Business',
            tags: []
          },
          {
            id: '1-3-2',
            order: 2,
            type: 'User Story',
            title: 'Data',
            state: 'New',
            valueArea: 'Business',
            tags: []
          }
        ]
      },
      {
        id: '1-4',
        order: 4,
        type: 'Feature',
        title: 'Deployment',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: [
          {
            id: '1-4-1',
            order: 1,
            type: 'User Story',
            title: 'Project Starter',
            state: 'New',
            valueArea: 'Business',
            tags: []
          }
        ]
      },
      {
        id: '1-5',
        order: 5,
        type: 'Feature',
        title: 'Training',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: []
      },
      {
        id: '1-6',
        order: 6,
        type: 'Feature',
        title: 'QA and Issue',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: []
      },
      {
        id: '1-7',
        order: 7,
        type: 'Feature',
        title: 'Maintenance',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: []
      }
    ]
  },
  {
    id: '2',
    order: 2,
    type: 'Epic',
    title: 'MOOE',
    state: 'New',
    valueArea: 'Business',
    tags: [],
    expanded: false,
    children: [
      {
        id: '2-1',
        order: 1,
        type: 'Feature',
        title: 'MOOE Feature 1',
        state: 'New',
        valueArea: 'Business',
        tags: [],
        expanded: false,
        children: []
      }
    ]
  },
  {
    id: '3',
    order: 3,
    type: 'Epic',
    title: 'CHOE',
    state: 'New',
    valueArea: 'Business',
    tags: [],
    expanded: false,
    children: []
  },
  {
    id: '4',
    order: 4,
    type: 'Epic',
    title: 'OE Assessment',
    state: 'New',
    valueArea: 'Business',
    tags: [],
    expanded: false,
    children: []
  },
  {
    id: '5',
    order: 5,
    type: 'Epic',
    title: 'Activity 2',
    state: 'New',
    valueArea: 'Business',
    tags: [],
    expanded: false,
    children: []
  }
];

const BacklogPage = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>(mockData);
  const [isNewWorkItemModalOpen, setIsNewWorkItemModalOpen] = useState(false);

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

  return (
    <div className="h-full">
      <BacklogHeader
        onNewWorkItem={() => setIsNewWorkItemModalOpen(true)}
      />

      <div className="p-6">
        <BacklogGrid
          workItems={workItems}
          onToggleExpand={handleToggleExpand}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
        />
      </div>
      <WorkItemModal
        isOpen={isNewWorkItemModalOpen}
        onClose={() => setIsNewWorkItemModalOpen(false)}
      />
      {/* <NewWorkItemModal
        isOpen={isNewWorkItemModalOpen}
        onClose={() => setIsNewWorkItemModalOpen(false)}
        workItemType="Epic"
      /> */}
    </div>
  );
};

export default BacklogPage;
