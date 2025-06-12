import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/_components/common/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/common/select';
import { Input } from '@/_components/common/input';
import { Menu, X, Search, SearchCheck } from 'lucide-react';
import { ResetIcon } from '@radix-ui/react-icons';

// Zod schema for filter form validation
const filterSchema = z.object({
  keyword: z.string().optional(),
  type: z.enum(['all', 'epic', 'feature', 'user-story']).optional(),
  state: z.enum(['all', 'new', 'active', 'resolved', 'closed']).optional(),
  area: z.enum(['all', 'business', 'architectural']).optional(),
  tags: z.enum(['all']).optional(),
});

export type FilterForm = z.infer<typeof filterSchema>;

interface FilterBarProps {
  isVisible: boolean;
  onClose: () => void;
  onFilterChange?: (filters: FilterForm) => void;
}

const FilterBar = ({ isVisible, onClose, onFilterChange }: FilterBarProps) => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      keyword: '',
      type: 'all',
      state: 'all',
      area: 'all',
      tags: 'all',
    }
  });

  // Watch for changes and call onFilterChange
  // const watchedValues = watch();
  // useEffect(() => {
  //   // onFilterChange?.(watchedValues);
  // }, [watchedValues, onFilterChange]);

  const onSubmit = (data: FilterForm) => {
    console.log('onSubmit', data);
    onFilterChange?.(data);
  };

  const handleReset = () => {
    reset();
  };

  if (!isVisible) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-4 py-2 px-4 bg-[#2d2d30] border-b border-gray-700 text-[10px]">
        {/* Keyword Filter */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <Input
            {...register('keyword')}
            placeholder="Filter by keyword"
            className={`pl-10 bg-[#1e1e1e] border-gray-600 text-white placeholder-gray-400 min-w-[200px] text-xs ${errors.keyword ? 'border-red-500' : ''
              }`}
          />
          {errors.keyword && (
            <span className="absolute -bottom-5 left-0 text-red-500 text-xs">
              {errors.keyword.message}
            </span>
          )}
        </div>

        {/* Types Filter */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px] text-xs">
                <SelectValue placeholder="Types" />
              </SelectTrigger>
              <SelectContent className="bg-[#252526] border-gray-600 text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="user-story">User Story</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* States Filter */}
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px] text-xs">
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
          )}
        />

        {/* Area Filter */}
        <Controller
          name="area"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px] text-xs">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent className="bg-[#252526] border-gray-600 text-white">
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="architectural">Architectural</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Tags Filter */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-[#1e1e1e] border-gray-600 text-white min-w-[120px] text-xs">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent className="bg-[#252526] border-gray-600 text-white">
                <SelectItem value="all">All Tags</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="submit"
            variant="ghost"
            size="xs"
            className="text-gray-300 hover:text-white hover:bg-gray-700 text-xs px-3"
          >
            <SearchCheck />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleReset}
            className="text-gray-300 hover:text-white hover:bg-gray-700 text-xs px-3"
          >
            <ResetIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FilterBar;
