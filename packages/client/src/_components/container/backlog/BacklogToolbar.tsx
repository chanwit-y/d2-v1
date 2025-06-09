
'use client'
import React from 'react';
import { Button } from '@/_components/common/button';
import { Plus, Minus } from 'lucide-react';

interface BacklogToolbarProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const BacklogToolbar = ({
  onExpandAll,
  onCollapseAll
}: BacklogToolbarProps) => {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="flex items-center border border-gray-700 rounded">
        <Button
          variant="ghost"
          size="xs"
          onClick={onExpandAll}
          className="border-r border-gray-700 rounded-none text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={onCollapseAll}
          className="rounded-none text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default BacklogToolbar;
