import React from 'react';
import { Box, Typography } from '@mui/material';
import Prompts from './Prompts';
import GraphSettings from './GraphSettings';

function RulesSettings({ formData, onFormDataChange, nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }) {
    const handleChange = (event) => {
        onFormDataChange({ [event.target.name]: event.target.value });
    };

    return (
        <Box>
            <Typography variant='h1'> Rules Settings go here </Typography>

            {formData.basicConfig.assistantType == "FreeFlowing" ? (
                <Prompts formData={formData} onFormDataChange={onFormDataChange} />
            ) : (
                <GraphSettings formData={formData} onFormDataChange={onFormDataChange}
                    nodes={nodes}
                    setNodes={setNodes}
                    onNodesChange={onNodesChange}
                    edges={edges}
                    setEdges={setEdges}
                    onEdgesChange={onEdgesChange} />
            )}
        </Box>

    );
}

export default RulesSettings;
