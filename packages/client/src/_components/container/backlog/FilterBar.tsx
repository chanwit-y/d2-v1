import React from 'react';
import { Button } from '@/_components/common/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/common/select';
import { Input } from '@/_components/common/input';
import { Menu, X } from 'lucide-react';

interface FilterBarProps {
  isVisible: boolean;
  onClose: () => void;
}

const FilterBar = ({ isVisible, onClose }: FilterBarProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-4 py-3 px-4 bg-[#2d2d30] border-b border-gray-700 text-[10px]">
      {/* Keyword Filter */}
      <div className="relative flex items-center">
        <Menu className="absolute left-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Filter by keyword"
          className="pl-10 bg-[#1e1e1e] border-gray-600 text-white placeholder-gray-400 min-w-[200px]"
        />
      </div>

      {/* Types Filter */}
      <Select>
        <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px]">
          <SelectValue placeholder="Types" />
        </SelectTrigger>
        <SelectContent className="bg-[#252526] border-gray-600 text-white">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="epic">Epic</SelectItem>
          <SelectItem value="feature">Feature</SelectItem>
          <SelectItem value="user-story">User Story</SelectItem>
        </SelectContent>
      </Select>

    
      {/* States Filter */}
      <Select>
        <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px]">
          <SelectValue placeholder="States" />
        </SelectTrigger>
        <SelectContent className="bg-[#252526] border-gray-600 text-white">
          <SelectItem value="all">All States</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      {/* Area Filter */}
      <Select>
        <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px]">
          <SelectValue placeholder="Area" />
        </SelectTrigger>
        <SelectContent className="bg-[#252526] border-gray-600 text-white">
          <SelectItem value="all">All Areas</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="architectural">Architectural</SelectItem>
        </SelectContent>
      </Select>

      {/* Iteration Filter */}
      <Select>
        <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px]">
          <SelectValue placeholder="Iteration" />
        </SelectTrigger>
        <SelectContent className="bg-[#252526] border-gray-600 text-white">
          <SelectItem value="all">All Iterations</SelectItem>
          <SelectItem value="current">Current</SelectItem>
          <SelectItem value="next">Next</SelectItem>
        </SelectContent>
      </Select>

      {/* Tags Filter */}
      <Select>
        <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px]">
          <SelectValue placeholder="Tags" />
        </SelectTrigger>
        <SelectContent className="bg-[#252526] border-gray-600 text-white">
          <SelectItem value="all">All Tags</SelectItem>
        </SelectContent>
      </Select>

      {/* Close Button */}
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="xs"
          onClick={onClose}
          className="text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
