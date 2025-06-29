"use client";
import { Button } from "@/_components/common/button";
import { Plus, Search } from "lucide-react";
import { useStore } from "./useStore";

export const MapToolbar = () => {
	const { addNode } = useStore();

	const handleAddIcon = () => {
		addNode({
			id: crypto.randomUUID(),
			type: 'MindMapNode',
			position: { x: 50, y: 50 },
			data: { label: 'Node 1' },
		});
		// TODO: Implement add new icon functionality

		console.log("Add new icon clicked");
	};

	return (
		<div className=" absolute top-5 left-2 flex flex-col gap-2 p-2 backdrop-blur-sm rounded-lg z-20">
			<Button
				variant="outline"
				size="xs"
				onClick={handleAddIcon}
				className="flex items-center gap-2"
			>
				<Plus className="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="xs"
				className="flex items-center gap-2"
			>
				<Search className="h-4 w-4" />
			</Button>
		</div>
	);
}; 