import React, { useState } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, FormGroup, FormControlLabel, Checkbox, FormLabel, Chip, Input } from '@mui/material';
import { renderTooltip } from '../../components/CustomTooltip';

function FollowUpTasks({ formData, onFormDataChange }) {
    const [selectedTasks, setSelectedTasks] = useState(formData.followUpTaskConfig.tasks);
    const [selectedNotificationMethods, setSelectedNotificationMethods] = useState(formData.followUpTaskConfig.notificationDetails.notificationMethods);

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

            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <FormControl sx={{ width: "60%" }} margin="normal">
                    <InputLabel>Tasks</InputLabel>
                    <Select
                        multiple
                        value={selectedTasks}
                        onChange={handleTasksChange}
                        input={<Input variant="standard" id="select-multiple-chip" label="Chip" />}
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
                    <Box sx={{ justifyContent: 'space-between', flexDirection: "column", display: 'flex', alignItems: 'center', width: '70%', marginY: 1 }}>

                        <Box sx={{ display: 'block' }}>
                        </Box>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Extraction Details"
                                multiline
                                rows={4}
                                margin="normal"
                                placeholder="What information would you like to extract. Name that data point and explalain it. user intent - Is user interested or not"
                                name="extractionDetails"
                                onChange={handleTasksChange}
                            />
                        </FormControl>
                        <Box sx={{ display: 'block', justifyContent: 'left', alignContent: 'left' }}>
                            <Typography variant='h5'> Helpful Tips </Typography>
                            <Typography variant="body1" sx={{ mt: 2, textAlign: 'left' }}>
                                Kindly mention the details you'd like to extract from the transcript of conversation in a list and give examples for AI to understand.
                                For example if you'd like to extract user intent the mention
                                <ol>
                                    <li>
                                        user intent - intent for the user to come back on app.
                                    </li>
                                    <li>
                                        user pulse - Whether the user beleives India will win the world cup or not. Example Austrailia will win the cup, yields no, Rohit Sharma will finally get a world cup medal yields yes

                                    </li>
                                </ol>

                            </Typography>
                        </Box>
                    </Box>
                )}

            </Box>

        </Box>
    );
}

export default FollowUpTasks;
