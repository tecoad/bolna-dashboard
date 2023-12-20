import React, { useState } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, FormGroup, FormControlLabel, Checkbox, FormLabel, Chip, OutlinedInput } from '@mui/material';

function FollowUpTasks({ formData, onFormDataChange }) {
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedNotificationMethods, setSelectedNotificationMethods] = useState([]);

    const handleTasksChange = (event) => {
        const { name, value } = event.target;
        console.log(`Got task Chagne event ${name}, ${value}`)
        if (name === "extractionDetails") {
            onFormDataChange({
                ...formData,
                followUpTaskConfig: {
                    ...formData.followUpTaskConfig,
                    [name]: value,
                },
            });
        } else if (name === "notificationMethods") {
            const updatedNotificationMethods = event.target.checked
                ? [...selectedNotificationMethods, value]
                : selectedNotificationMethods.filter((method) => method !== value);

            setSelectedNotificationMethods([...updatedNotificationMethods]);

            // Update form data
            onFormDataChange({
                ...formData,
                followUpTaskConfig: {
                    ...formData.followUpTaskConfig,
                    notificationDetails: {
                        ...formData.followUpTaskConfig.notificationDetails,
                        notificationMethods: [...updatedNotificationMethods],
                    }
                },
            });

            console.log(`Updated notification MEthodss ${JSON.stringify(updatedNotificationMethods)}`)
        } else {
            setSelectedTasks(value);
            onFormDataChange({
                ...formData,
                followUpTaskConfig: {
                    ...formData.followUpTaskConfig,
                    selectedTasks: value,
                },
            });
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
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox
                                checked={selectedNotificationMethods.includes('email')}
                                onChange={handleTasksChange}
                                name="notificationMethods"
                                value="email"
                            />}
                            label="Email"
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={selectedNotificationMethods.includes('whatsapp')}
                                onChange={handleTasksChange}
                                name="notificationMethods"
                                value="whatsapp"
                            />}
                            label="Whatsapp"
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={selectedNotificationMethods.includes('sms')}
                                onChange={handleTasksChange}
                                name="notificationMethods"
                                value="sms"
                            />}
                            label="SMS"
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={selectedNotificationMethods.includes('calendar')}
                                onChange={handleTasksChange}
                                name="notificationMethods"
                                value="calendar"
                            />}
                            label="Calendar Invite"
                        />
                    </FormGroup>
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
