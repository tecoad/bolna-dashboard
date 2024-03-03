import React, { useEffect, useState } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField, FormGroup, FormControlLabel, Checkbox, FormLabel, Chip, Input } from '@mui/material';
import { renderTooltip } from '../../components/CustomTooltip';
import { Mixpanel } from '../../utils/mixpanel';


function FollowUpTasks({ formData, onFormDataChange, llmModels }) {
    const [selectedTasks, setSelectedTasks] = useState(formData.followUpTaskConfig.selectedTasks);
    const [selectedNotificationMethods, setSelectedNotificationMethods] = useState(formData.followUpTaskConfig.notificationDetails.notificationMethods);
    const [followupTaskLLMS, setFollowupTaskLLMS] = useState([])

    useEffect(() => {
        if (formData.basicConfig.assistantType == "IVR") {
            let filteredLLMModels = llmModels.filter(model => model.json_mode == "Yes");
            //console.log(`Filtered LLM Model = ${JSON.stringify(filteredLLMModels)}`)
            setFollowupTaskLLMS([...filteredLLMModels]);
        }
    }, [formData])

    //console.log(`Form data follow up tasks ${JSON.stringify(formData)}`)
    const handleTasksChange = (event) => {
        const { name, value } = event.target;
        Mixpanel.track('agent_tasks', {
            val: value
        });

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

            //console.log(`Updated notification MEthodss ${JSON.stringify(updatedNotificationMethods)}`)
        } else if (name === "webhookURL") {
            onFormDataChange({
                ...formData,
                followUpTaskConfig: {
                    ...formData.followUpTaskConfig,
                    notificationDetails: {
                        ...formData.followUpTaskConfig.notificationDetails,
                        webhookURL: value,
                    }
                },
            });
        } else {
            if (value.includes("webhook") && !value.includes("extraction")) {
                value.push("extraction")
            }
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

    const isNotificationSelected = selectedTasks.includes('webhook');
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
                        <MenuItem value="webhook">Webhook</MenuItem>
                        <MenuItem value="extraction">Extraction</MenuItem>
                    </Select>
                </FormControl>
                {isNotificationSelected && (
                    <Box sx={{ justifyContent: 'space-between', flexDirection: "column", display: 'flex', alignItems: 'center', width: '70%', marginY: 1 }}>

                        <Box sx={{ display: 'block' }}>
                        </Box>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Webhook URL"
                                defaultValue={formData?.followUpTaskConfig?.notificationDetails?.webhookURL}
                                margin="normal"
                                placeholder="Webhook we should notify the output too"
                                name="webhookURL"
                                onChange={handleTasksChange}
                            />
                        </FormControl>
                    </Box>
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
                                defaultValue={formData?.followUpTaskConfig?.extractionDetails}
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
                                For example if you'd like to extract user intent then mention
                                <ol>
                                    <li>
                                        user intent - intent for the user to come back on app.
                                    </li>
                                    <li>
                                        user pulse - Whether the user beleives India will win the world cup or not. Example Austrailia will win the cup, yields no, Rohit Sharma will finally get a world cup medal yields yes

                                    </li>
                                    {
                                        isNotificationSelected ? (
                                            <li>
                                                <b> Webhook payload - If you've chosen webhook trigger as a followup task as well, make sure that your extraction prompt triggers the task. Explicitly mention the json keys required.</b>

                                            </li>
                                        ) : null
                                    }

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
