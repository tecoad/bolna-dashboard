import React, { useState } from 'react';
import { Box, TextField, Checkbox, FormControlLabel } from '@mui/material';

function NodeDetails({ nodeData, setNodeData }) {
    // State for the checkbox
    const [useTemplate, setUseTemplate] = useState(false);
    const [examplesValue, setExamplesValue] = useState(nodeData.examples != "" && nodeData.examples != undefined && nodeData.examples != null ? nodeData.examples : "")

    const handleInputChange = (e) => {
        console.log(`node data ${JSON.stringify(nodeData)}`)
        setNodeData({ ...nodeData, [e.target.name]: e.target.value });
        if (e.target.name === "examples" && useTemplate === true) {
            setExamplesValue(e.target.value)
        }
    };

    // Handle changes to the checkbox
    const handleCheckboxChange = (event) => {
        if (!useTemplate) {
            setExamplesValue(templateText)
        }
        setUseTemplate(event.target.checked);

    };

    // Template text
    const templateText = `
*Edit the given example to suit your needs and completely remove it if you do not want to classify message beyond this point*
Explanation of children labels with examples go here. For child labels interested and not interested follow the possible example list should be.
For If user utters anything that indicates that they're interested yield interested Example 
1. Yes, speaking
2. Who's this
3. No, but who's speaking

If user is not interested yield not_interested. For example
1. Not interested
2. Go screw yourself
3. Yes speaking but call me later.
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
