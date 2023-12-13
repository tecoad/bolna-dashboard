import React from 'react';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import GraphInterface from '../../components/GraphInterface';

function GraphSettings({ formData, onFormDataChange, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }) {
    const handleChange = (event) => {
        onFormDataChange({ [event.target.name]: event.target.value });
    };

    return (
        <form>
            <GraphInterface nodes={nodes}
                setNodes={setNodes}
                onNodesChange={onNodesChange}
                edges={edges}
                setEdges={setEdges}
                onEdgesChange={onEdgesChange} />
        </form>
    );
}

export default GraphSettings;
