import React from 'react';
import { TextField, FormControl, FormLabel, Select, MenuItem, InputLabel, Box, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function BasicConfiguration({ formData, onFormDataChange }) {
    const handleChange = (event) => {
        console.log(`NAME ${event.target.name}`);
        onFormDataChange({
            ...formData, basicConfig: { ...formData.basicConfig, [event.target.name]: event.target.value }
        });
    };

    const renderTooltip = (title) => (
        <Tooltip title={title}>
            <IconButton aria-label="info">
                <HelpOutlineIcon />
            </IconButton>
        </Tooltip>
    );

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

            {/* Add more form controls and tooltips as needed */}

        </Box>
    );
}

export default BasicConfiguration;
