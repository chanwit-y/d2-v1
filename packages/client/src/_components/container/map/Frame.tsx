"use client";
import { addEdge, Background, Connection, Controls, Edge, MarkerType, ReactFlow } from '@xyflow/react';
import { useCallback, useEffect } from 'react';
import { MindMapNode } from './MindMapNode';
import { useStore } from './useStore';

const nodeTypes = {
	MindMapNode: MindMapNode
};

export const Frame = () => {
	const { nodes, edges, setEdges, onNodesChange, onEdgesChange } = useStore();

	useEffect(() => {
		document.querySelector('.react-flow__panel.react-flow__attribution')?.remove()
	}, [])

	const onConnect = useCallback((params: Connection) => {
		const edgeWithCustomProps = {
			...params,
			markerEnd: {
				type: MarkerType.ArrowClosed,
				width: 20,
				height: 20,
				color: '#60A5FA',
			},
			label: 'some label',
			style: {
				strokeWidth: 2,
				stroke: '#60A5FA',
			},
		}
		const newEdges = addEdge(edgeWithCustomProps, edges)
		setEdges(newEdges)
	}, [edges, setEdges]);


	return (
		<div className="h-[calc(100vh-3rem)]  w-[calc(100vw-3rem)] ">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodeTypes={nodeTypes}
				onConnect={onConnect}
			>
				<Background />
				<div className='text-black '>
					<Controls position="bottom-right" />
				</div>
			</ReactFlow>
		</div>
	)
}