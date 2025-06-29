import { create } from 'zustand'
import type { Node, NodeChange, Edge, EdgeChange } from '@xyflow/react'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

type State = {
  nodes: Node[]
  edges: Edge[]
}

type Action = {
  addNode: (node: Node) => void
  setNodes: (nodes: Node[]) => void
  onNodesChange: (changes: NodeChange<Node>[]) => void
  addEdge: (edge: Edge) => void
  setEdges: (edges: Edge[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
}

export const useStore = create<State & Action>((set, get) => ({
  nodes: [{
    id: '1',
    type: 'MindMapNode',
    position: { x: 100, y: 20 },
    data: { label: 'Node 1' },
  }],
  edges: [],
  addNode: (node: Node) => set((state) => ({ nodes: [...state.nodes, node] })),
  setNodes: (nodes: Node[]) => set({ nodes }),
  onNodesChange: (changes: NodeChange<Node>[]) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }))
  },
  addEdge: (edge: Edge) => set((state) => ({ edges: [...state.edges, edge] })),
  setEdges: (edges: Edge[]) => set({ edges }),
  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }))
  }
}))