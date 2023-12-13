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

    return (
        <Box sx={{ width: '100%' }}> {/* Container Box with full width */}

            <Box sx={{ alignItems: "left" }}>
                <FormControl sx={{ alignItems: "left", width: "50%" }} margin="normal"> {/* Each FormControl takes full width */}
                    <TextField
                        label="Assistant Name"
                        variant="outlined"
                        name="assistantName"
                        value={formData.basicConfig.assistantName || ''}
                        onChange={handleChange}
                    />
                </FormControl>
            </Box>


            <Box sx={{ alignItems: "left" }}>
                <FormControl sx={{ alignItems: "left", width: "50%" }} margin="normal">
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
            </Box>

            <Box sx={{ alignItems: "left" }}>
                <FormControl sx={{ alignItems: "left", width: "50%" }} margin="normal">
                    <InputLabel id="task-label">Task for Assistant</InputLabel>

                    <Select
                        labelId="task-label"
                        id="task-select"
                        name="assistantTask"
                        value={formData.basicConfig.assistantTask || ''}
                        label="Task for Assistant"
                        onChange={handleChange}
                    >
                        <MenuItem value="LeadQualification">Lead Qualification</MenuItem>
                        <MenuItem value="CustomerService">Customer Service</MenuItem>
                        <MenuItem value="SalesAndMarketing">Sales and Marketing</MenuItem>
                        <MenuItem value="Recruiting">Recruiting</MenuItem>
                        <MenuItem value="Recruiting">Survey/ Feedback </MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    <Tooltip title="This is what My Field is for.">
                        <IconButton aria-label="info">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Tooltip>
                </FormControl>

            </Box>
        </Box>
    );
}

export default BasicConfiguration;
