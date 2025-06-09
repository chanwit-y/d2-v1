
import React, { useState, KeyboardEvent } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/_components/common/button';
import { Input } from '@/_components/common/input';
import { Badge } from '@/_components/common/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/_components/common/dialog';
import MDEditor from '@uiw/react-md-editor';

interface NewWorkItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  workItemType?: 'Epic' | 'Feature' | 'User Story';
}

const NewWorkItemModal = ({
  isOpen,
  onClose,
  workItemType = 'Epic'
}: NewWorkItemModalProps) => {
  const [title, setTitle] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setShowTitleError(true);
      return;
    }
    // Handle save logic here
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (showTitleError && e.target.value.trim()) {
      setShowTitleError(false);
    }
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] h-[90vh] bg-[#1e1e1e] border-gray-700 p-0 overflow-hidden">
        <DialogTitle className="sr-only">New {workItemType}</DialogTitle>
        <DialogDescription className="sr-only">Create a new {workItemType.toLowerCase()} work item</DialogDescription>
        
        {/* Header */}
        <DialogHeader className="bg-[#252526] border-b border-gray-700 p-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold uppercase tracking-wide">NEW {workItemType.toUpperCase()}</span>
            </div>
            {showTitleError && (
              <div className="flex items-center gap-2 text-red-400">
                <span className="text-red-400">●</span>
                <span className="text-sm">Field 'Title' cannot be empty.</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Title Input */}
        <div className="p-4 bg-[#252526] border-b border-gray-700">
          <Input 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="Enter title" 
            className={`bg-[#1e1e1e] border-2 text-white text-lg h-12 ${showTitleError ? 'border-red-500' : 'border-blue-500'}`} 
          />
        </div>

        {/* Tags Section */}
        <div className="p-4 bg-[#252526] border-b border-gray-700 space-y-3">
          <h3 className="text-white font-medium text-sm">Tags</h3>
          <div className="space-y-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Enter a tag and press Enter"
              className="bg-[#1e1e1e] border border-gray-600 text-white text-sm h-9"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:bg-blue-800 rounded" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6 space-y-6 px-[24px] py-6">
            {/* Description with MDEditor */}
            <div className="space-y-3">
              <h3 className="text-white font-medium">Description</h3>
              <div className="border border-gray-600 rounded overflow-hidden" data-color-mode="dark">
                <MDEditor 
                  value={description} 
                  onChange={val => setDescription(val || '')} 
                  preview="edit" 
                  hideToolbar={false} 
                  data-color-mode="dark" 
                  height={200} 
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-700 bg-[#252526] p-4">
            <div className="flex items-center justify-end">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save and Close
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkItemModal;
