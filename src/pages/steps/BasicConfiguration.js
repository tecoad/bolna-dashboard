import React from 'react';
import { TextField, FormControl, FormLabel, Select, MenuItem, InputLabel, Box, Tooltip, IconButton, Radio, RadioGroup, FormControlLabel, FormGroup } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { renderTooltip } from '../../components/CustomTooltip';
function BasicConfiguration({ formData, onFormDataChange }) {
    const handleChange = (event) => {
        console.log(`NAME ${event.target.name}`);
        onFormDataChange({
            ...formData, basicConfig: { ...formData.basicConfig, [event.target.name]: event.target.value }
        });
    };

    const handleRadioChange = (event) => {
        let engagementConfig = {}
        if (event.target.value === 'Websocket') {
            engagementConfig = {
                "channel": "Websocket",
                "format": "wav"
            }
        } else {
            engagementConfig = {
                "channel": "Telephone",
                "format": "pcm"
            }
        }

        onFormDataChange({
            ...formData, engagementConfig: { ...engagementConfig }

        });
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginY: 1 }}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Assistant Name"
                        variant="outlined"
                        name="assistantName"
                        value={formData.basicConfig.assistantName || ''}
                        onChange={handleChange}
                    />
                </FormControl>
                {renderTooltip("Information about Assistant Name")}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginY: 1 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="assistant-type-label">Type of Assistant</InputLabel>
                    <Select
                        labelId="assistant-type-label"
                        id="assistant-type-select"
                        name="assistantType"
                        value={formData.basicConfig.assistantType || ''}
                        label="Type of Assistant"
                        onChange={handleChange}
                    >
                        <MenuItem value="IVR">IVR Type</MenuItem>
                        <MenuItem value="FreeFlowing">Free Flowing</MenuItem>
                    </Select>
                </FormControl>
                {renderTooltip("Details about Type of Assistant")}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginY: 1 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="task-label">Task for Assistant</InputLabel>
                    <Select
                        labelId="task-label"
                        id="task-select"
                        name="assistantTask"
                        value={formData.basicConfig.assistantTask || ''}
                        label="Task for Assistant"
                        onChange={handleChange}
                    >
                        <MenuItem value="Lead Qualification">Lead Qualification</MenuItem>
                        <MenuItem value="Customer Service">Customer Service</MenuItem>
                        <MenuItem value="Sales And Marketing">Sales and Marketing</MenuItem>
                        <MenuItem value="Recruiting">Recruiting</MenuItem>
                        <MenuItem value="Survey/Feedback">Survey/ Feedback </MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
                {renderTooltip("Explanation of Task for Assistant")}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginY: 1 }}>
                <FormControl component="fieldset" fullWidth margin="normal">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', marginRight: 2 }}>
                            Assistant Invocation
                        </FormLabel>
                        <RadioGroup
                            row
                            name="assistantInvocation"
                            value={formData.engagementConfig.channel}
                            onChange={handleRadioChange}
                        >
                            <FormControlLabel value="Websocket" control={<Radio />} label="Websocket" />
                            <FormControlLabel value="Telephone" control={<Radio />} label="Telephone" />
                        </RadioGroup>
                        {renderTooltip("Choose the method of Assistant invocation")}
                    </Box>
                </FormControl>
            </Box>

        </Box>
    );
}

export default BasicConfiguration;
