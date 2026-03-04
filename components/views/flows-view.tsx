'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Handle,
  Position,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { Network, X, CheckCircle2, Loader2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { useFlowStore } from '@/store/flow-store';

const CustomNode = ({ data, isConnectable }: any) => {
  return (
    <div className={`px-6 py-4 rounded-2xl border ${data.isActive ? 'border-clay shadow-[0_0_20px_rgba(204,88,51,0.2)]' : 'border-border'} bg-surface/90 backdrop-blur-sm min-w-[200px] transition-all`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-border border-none" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">{data.id}</span>
          <div className={`w-2 h-2 rounded-full ${
            data.status === 'success' ? 'bg-moss' : 
            data.status === 'running' ? 'bg-clay animate-pulse' : 
            data.status === 'error' ? 'bg-red-500' : 
            'bg-border'
          }`} />
        </div>
        <h3 className="font-bold text-sm text-text-primary">{data.label}</h3>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-border border-none" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { id: 'NODE_01', label: 'Raw Intent', status: 'idle' } },
  { id: '2', type: 'custom', position: { x: 100, y: 150 }, data: { id: 'NODE_02', label: 'Intent Analysis', status: 'idle' } },
  { id: '3', type: 'custom', position: { x: 400, y: 150 }, data: { id: 'NODE_03', label: 'Creative Structure', status: 'idle' } },
  { id: '4', type: 'custom', position: { x: 250, y: 300 }, data: { id: 'NODE_04', label: 'Carousel Generation', status: 'idle' } },
  { id: '8', type: 'custom', position: { x: 250, y: 450 }, data: { id: 'NODE_08', label: 'Preview Build', status: 'idle' } },
  { id: '9', type: 'custom', position: { x: 250, y: 600 }, data: { id: 'NODE_09', label: 'Export Packaging', status: 'idle' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--border)' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: 'var(--border)' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: 'var(--border)' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: 'var(--border)' } },
  { id: 'e4-8', source: '4', target: '8', animated: true, style: { stroke: 'var(--border)' } },
  { id: 'e8-9', source: '8', target: '9', animated: true, style: { stroke: 'var(--border)' } },
];

export function FlowsView() {
  const { nodeStatuses, activeNode } = useFlowStore();
  const { theme } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);

  useEffect(() => {
    setNodes((nds) => nds.map((node) => ({
      ...node,
      data: {
        ...node.data,
        status: nodeStatuses[node.id],
        isActive: activeNode === node.id,
      },
    })));

    setEdges((eds) => eds.map((edge) => ({
      ...edge,
      animated: nodeStatuses[edge.source] === 'running' || nodeStatuses[edge.target] === 'running',
      style: { 
        stroke: nodeStatuses[edge.source] === 'success' ? 'rgba(46,64,54,0.8)' : 
                nodeStatuses[edge.source] === 'running' ? 'rgba(204,88,51,0.8)' : 
                'rgba(255,255,255,0.2)' 
      }
    })));
  }, [nodeStatuses, activeNode, setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Network className="text-clay" />
            Flow Orchestrator
          </h2>
          <p className="text-text-secondary text-sm mt-1">Directed Acyclic Graph (DAG) for task execution.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-[3rem] border border-border shadow-lg overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background/50"
          colorMode={theme === 'dark' ? 'dark' : 'light'}
        >
          <Background variant={BackgroundVariant.Dots} color="var(--border)" gap={24} />
          <Controls className="bg-surface border-border fill-text-primary" />
          <MiniMap 
            className="bg-surface border-border" 
            nodeColor={(n) => {
              const status = nodeStatuses[n.id];
              if (status === 'success') return 'var(--moss)';
              if (status === 'running') return 'var(--clay)';
              if (status === 'error') return '#ef4444';
              return 'var(--border)';
            }}
            maskColor="var(--bg)"
          />
        </ReactFlow>

        {/* Node Details Panel */}
        <AnimatePresence>
          {selectedNodeData && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-surface/95 backdrop-blur-xl border-l border-border p-6 shadow-2xl z-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-mono text-sm tracking-widest text-text-secondary">{selectedNodeData.id}</h3>
                <button 
                  onClick={() => setSelectedNodeData(null)}
                  className="p-2 rounded-full hover:bg-background transition-colors text-text-secondary hover:text-text-primary"
                >
                  <X size={16} />
                </button>
              </div>

              <h2 className="text-xl font-bold mb-6 text-text-primary">{selectedNodeData.label}</h2>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-xs font-mono text-text-secondary mb-2 uppercase">Current Status</h4>
                  <div className="flex items-center gap-2 bg-background p-3 rounded-xl border border-border">
                    {selectedNodeData.status === 'success' && <CheckCircle2 size={16} className="text-moss" />}
                    {selectedNodeData.status === 'running' && <Loader2 size={16} className="text-clay animate-spin" />}
                    {selectedNodeData.status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                    {selectedNodeData.status === 'idle' && <Clock size={16} className="text-text-secondary" />}
                    <span className="capitalize font-medium text-text-primary">{selectedNodeData.status}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono text-text-secondary mb-2 uppercase">Node Properties</h4>
                  <div className="bg-background p-4 rounded-xl border border-border space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Idempotent</span>
                      <span className="text-moss">True</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Retries</span>
                      <span className="text-text-primary">3/3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Timeout</span>
                      <span className="text-text-primary">30s</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="w-full py-3 rounded-xl bg-background hover:bg-surface border border-border transition-colors font-medium text-sm flex items-center justify-center gap-2 text-text-primary"
                disabled={selectedNodeData.status === 'running'}
              >
                <RefreshCw size={14} />
                Force Regenerate Node
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
