import { Handle, Position } from '@xyflow/react';
import { MindMapTabs } from './MindMapTabs';

export const MindMapNode = () => {
	return (
		<div className="bg-gray-900/90 text-white backdrop-blur-sm rounded-lg p-4 w-96 border border-gray-700 relative">
			{/* Target Handle (Left) - for incoming connections */}
			<Handle
				type="target"
				position={Position.Left}
				className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
			/>
			
			<MindMapTabs />
			
			{/* Source Handle (Right) - for outgoing connections */}
			<Handle
				type="source"
				position={Position.Right}
				className="w-3 h-3 bg-green-500 border-2 border-white rounded-full"
			/>
		</div>
	)
}