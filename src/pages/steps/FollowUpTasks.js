import React, { useState } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, Chip, OutlinedInput } from '@mui/material';

function FollowUpTasks({ formData, onFormDataChange }) {
    const [selectedTasks, setSelectedTasks] = useState([]);


    const handleTasksChange = (event) => {
        setSelectedTasks(event.target.value);
        var val = event.target.value


        if (event.target.name == "extractionDetails" || event.target.name == "NotificationMethod") {
            console.log(`event.target.name ${event.target.name}, event.target.value ${event.target.value} `)
            onFormDataChange({ ...formData, followUpTaskConfig: { ...formData.followUpTaskConfig, [event.target.name]: val.toLowerCase() } })
        } else {
            var val = event.target.value
            setSelectedTasks(event.target.value);
            console.log(`event.target.name ${event.target.name}, event.target.value ${val}  type = ${typeof val}`)
            onFormDataChange({ ...formData, followUpTaskConfig: { ...formData.followUpTaskConfig, selectedTasks: val } })
        }


    };

    const isNotificationSelected = selectedTasks.includes('notification');
    const isExtractionSelected = selectedTasks.includes('extraction');

    return (
        <Box>
            <Typography variant='h4'>Follow up tasks</Typography>

            <FormControl fullWidth margin="normal">
                <InputLabel>Tasks</InputLabel>
                <Select
                    multiple
                    value={selectedTasks}
                    onChange={handleTasksChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                >
                    <MenuItem value="summarization">Summarization</MenuItem>
                    <MenuItem value="notification">Notification</MenuItem>
                    <MenuItem value="extraction">Extraction</MenuItem>
                </Select>
            </FormControl>

            {isNotificationSelected && (
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Notification Method</FormLabel>
                    <RadioGroup row onChange={handleTasksChange} name="notificationMethod">
                        <FormControlLabel value="email" control={<Radio />} label="Email" />
                        <FormControlLabel value="whatsapp" control={<Radio />} label="Whatsapp" />
                        <FormControlLabel value="message" control={<Radio />} label="Message" />
                        <FormControlLabel value="calendar" control={<Radio />} label="Calendar Invite" />
                    </RadioGroup>
                </FormControl>
            )}

            {isExtractionSelected && (
                <Box margin="normal">
                    <Typography variant="subtitle1">Details to be extracted (JSON format)</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        placeholder="Enter details in JSON format about the information you'd exactly like to extract"
                        name="extractionDetails"
                        onChange={handleTasksChange}
                    />
                </Box>
            )}
        </Box>
    );
}

export default FollowUpTasks;