import React, { useState } from 'react';
import { Box, TextField, Checkbox, FormControlLabel } from '@mui/material';

function NodeDetails({ nodeData, setNodeData }) {
    // State for the checkbox
    const [useTemplate, setUseTemplate] = useState(false);
    const [examplesValue, setExamplesValue] = useState(nodeData.examples != "" && nodeData.examples != undefined && nodeData.examples != null ? nodeData.examples : "")

    const handleInputChange = (e) => {
        console.log(`node data ${JSON.stringify(nodeData)} name ${e.target.name}`)
        setNodeData({ ...nodeData, [e.target.name]: e.target.value });
        if (e.target.name == "examples") {
            console.log("Examples")
            setExamplesValue(e.target.value)
        }
    };

    // Handle changes to the checkbox
    const handleCheckboxChange = (event) => {
        if (!useTemplate) {
            setExamplesValue(templateText)
            setNodeData({ ...nodeData, examples: templateText });
        }
        setUseTemplate(event.target.checked);

    };

    // Template text
    const templateText = `
    (Edit the example to suit your needs. Delete explanatory messages when done)

    If user says anything that indicates they are interested yield interested. Example

    1. Yes, speaking
    2. No, who is this?
    3. Who are you
    4. Yes tell me

    If user says anything that indicates they are not interested in this conversation yield not_interested. Example

    1. Don’t bother me
    2. How dare you call me
    3. I am not interested

    (You should make 2 nodes with the label interested and not_interested and connect this node to those. If this is the final node of the conversation, this entire text box should be blank)
    `;


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

            <FormControlLabel
                control={
                    <Checkbox
                        checked={useTemplate}
                        onChange={handleCheckboxChange}
                    />
                }
                label="Use Template"
            />

            <TextField
                margin="dense"
                id="examples"
                label="Few Shot Prompt"
                name="examples"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={10}
                value={examplesValue}
                onChange={handleInputChange}
            />
        </Box>
    );
}

export default NodeDetails;
