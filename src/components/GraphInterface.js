import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
} from 'react-flow-renderer';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import NodeDetails from './../pages/steps/IVRNodeDetails';

function GraphInterface({ nodes, onNodesChange, setNodes, edges, onEdgesChange, setEdges }) {
    const [open, setOpen] = useState(false);
    const [nodeData, setNodeData] = useState({ label: '', content: '', examples: '' });
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const handleOpenDialog = (node = null) => {
        setOpen(true);
        setSelectedNode(node);
        if (node && node.data) {
            setNodeData(node.data);
        } else {
            setNodeData({ label: '', content: '', examples: '' });
        }
    };

    const onSaveNode = () => {
        if (selectedNode) {
            // Update existing node
            setNodes((nds) => nds.map((nd) => nd.id === selectedNode.id ? { ...selectedNode, data: { ...nodeData } } : nd));
        } else {
            // Add new node
            setNodes((nds) => [...nds, {
                id: `node_${nds.length + 1}`,
                type: 'default',
                data: { ...nodeData },
                position: { x: Math.random() * window.innerWidth / 2, y: Math.random() * window.innerHeight / 2 },
            }]);
        }
        setOpen(false);
        setSelectedNode(null);
    };

    const onPaneClick = () => {
        setSelectedEdge(null);
    };


    const onNodeClick = (event, node) => {
        handleOpenDialog(node);
        setSelectedEdge(null);

    };
    const onDeleteNode = () => {
        if (selectedNode) {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
            setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
            setSelectedNode(null);
            setOpen(false);
        }
    };

    const onEdgeClick = (event, edge) => {
        setSelectedEdge(edge);
    };

    const onDeleteEdge = () => {
        if (selectedEdge) {
            setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
            setSelectedEdge(null); // Reset the selected edge
        }
    };




    return (
        <div style={{ height: 400 }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
            >
                <MiniMap />
                <Controls />
            </ReactFlow>

            {selectedEdge && (
                <Button disabled={selectedEdge == null} onClick={onDeleteEdge}>Delete Edge</Button>
            )}

            <Button variant="outlined" onClick={() => handleOpenDialog()}>Add Node</Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{selectedNode ? 'Edit Node' : 'Add a new IVR node'}</DialogTitle>
                <DialogContent>
                    <NodeDetails nodeData={nodeData} setNodeData={setNodeData} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={onSaveNode}>{selectedNode ? 'Save Changes' : 'Add Node'}</Button>
                    <Button variant="outlined" color="secondary" onClick={onDeleteNode} disabled={!selectedNode}>Delete Node</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GraphInterface;
