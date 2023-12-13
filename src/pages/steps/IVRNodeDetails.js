import React from 'react';
import { Box, TextField } from '@mui/material';
import Prompts from './Prompts';
import GraphSettings from './GraphSettings';

function NodeDetails({ nodeData, setNodeData }) {


    const handleInputChange = (e) => {
        console.log(`node data ${JSON.stringify(nodeData)}`)
        setNodeData({ ...nodeData, [e.target.name]: e.target.value });
    };


    return (
        <Box>

            <TextField
                autoFocus
                margin="dense"
                id="label"
                label="Node Label or the name of the response"
                name="label"
                type="text"
                fullWidth
                variant="outlined"
                value={nodeData.label}
                onChange={handleInputChange}
            />
            <TextField
                margin="dense"
                id="content"
                label="Response user will hear"
                name="content"
                type="text"
                fullWidth
                variant="outlined"
                value={nodeData.content}
                onChange={handleInputChange}
            />

            <TextField
                margin="dense"
                id="examples"
                label="Examples"
                name="examples"
                type="text"
                fullWidth
                variant="outlined"
                multiline  // Enable multiline input
                rows={4}   // Set the number of rows
                value={nodeData.examples}
                onChange={handleInputChange}
            />
        </Box>

    );
}

export default NodeDetails;
