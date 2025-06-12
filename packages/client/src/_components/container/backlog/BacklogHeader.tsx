import React from 'react';
import { Button } from '@/_components/common/button';
import { Plus, Filter } from 'lucide-react';

interface BacklogHeaderProps {
	onNewWorkItem: () => void;
}

const BacklogHeader = ({
	onNewWorkItem,
}: BacklogHeaderProps) => {
	return <div className="bg-[#252526] border-b border-gray-800">
		{/* Top Bar */}
		<div className="flex items-center justify-between px-6 py-3">
			<div className="flex items-center gap-3">
				<h1 className="text-lg font-semibold tracking-wide">Backlog</h1>
			</div>

			<div className="flex items-center gap-2">
			
				<Button onClick={onNewWorkItem}
					variant="ghost"
					size="xs"
					className="bg-blue-600 hover:bg-blue-700 text-white">
					<Plus className="w-4 h-4" />
				</Button>
			</div>
		</div>
	</div>;
};

export default BacklogHeader;