'use client'
import React, { useState } from 'react';
import { Button } from '@/_components/common/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/_components/common/dropdown-menu';
import {
	Menu,
	Filter,
	Expand,
	Settings,
	Maximize2,
	ChevronDown
} from 'lucide-react';
import FilterBar, { FilterForm } from './FilterBar';
import BacklogToolbar from './BacklogToolbar';

interface BacklogGridToolbarProps {
	onExpandAll: () => void;
	onCollapseAll: () => void;
	onFilterChange?: (filters: FilterForm) => void;
}

const BacklogGridToolbar = ({ onExpandAll, onCollapseAll, onFilterChange }: BacklogGridToolbarProps) => {
	const [isFilterBarVisible, setIsFilterBarVisible] = useState(false);

	const toggleFilterBar = () => {
		setIsFilterBarVisible(!isFilterBarVisible);
	};

	return (
		<>
			{/* Main Toolbar */}
			<div className="flex items-center justify-between gap-4 px-4 py-2 bg-[#252526] border-b border-gray-700 text-[10px]">
				{/* Left side - BacklogToolbar */}
				{/* <BacklogToolbar
					onExpandAll={onExpandAll}
					onCollapseAll={onCollapseAll}
				/> */}
				<div></div>

				{/* Right side - View Filter and Control Icons */}
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="xs"
								className="text-gray-300 hover:text-white hover:bg-gray-700 gap-2 text-[10px]"
							>
								<Menu className="w-4 h-4" />
								Epics
								<ChevronDown className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="bg-[#252526] border-gray-600 text-white"
						>
							<DropdownMenuItem className="hover:bg-gray-700">
								Epics
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:bg-gray-700">
								Features
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:bg-gray-700">
								User Stories
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:bg-gray-700">
								All Items
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Control Icons */}
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="xs"
							onClick={toggleFilterBar}
							className={`text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0 ${isFilterBarVisible ? 'bg-gray-700 text-white' : ''
								}`}
							title="Filter"
						>
							<Filter className="w-4 h-4" />
						</Button>

						{/* <Button
							variant="ghost"
							size="xs"
							onClick={onExpandAll}
							className="text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0"
							title="Expand All"
						>
							<Expand className="w-4 h-4" />
						</Button> */}

						<Button
							variant="ghost"
							size="xs"
							className="text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0"
							title="Settings"
						>
							<Settings className="w-4 h-4" />
						</Button>

						{/* <Button
							variant="ghost"
							size="xs"
							className="text-gray-300 hover:text-white hover:bg-gray-700 w-8 h-8 p-0"
							title="Fullscreen"
						>
							<Maximize2 className="w-4 h-4" />
						</Button> */}
					</div>
				</div>
			</div>

			{/* Filter Bar */}
			<FilterBar
				isVisible={isFilterBarVisible}
				onClose={() => setIsFilterBarVisible(false)}
				onFilterChange={onFilterChange}
			/>
		</>
	);
};

export default BacklogGridToolbar;
