import React from 'react';
import { TextField, FormControl, FormLabel, Select, MenuItem, InputLabel, Box, Tooltip, IconButton, Radio, RadioGroup, FormControlLabel, FormGroup } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { renderTooltip } from '../../components/CustomTooltip';
import leadQualificationJson from '../../data/templates/leadQualification.json';
import coachingJson from '../../data/templates/coaching.json';
import surveyJson from '../../data/templates/survey.json';
import recruitingJson from '../../data/templates/recruiting.json';
import salesAndMarketingJson from '../../data/templates/salesAndMarketing.json';
import customerServiceJson from '../../data/templates/customerService.json';
import virtualRMJson from '../../data/templates/virtualRM.json';
import otherJson from '../../data/templates/others.json';
import { Mixpanel } from '../../utils/mixpanel';


function getPrefilledTemplate(option) {
    switch (option) {
        case "Lead Qualification":
            return leadQualificationJson['task_1']
        case "Customer Service":
            return customerServiceJson['task_1']
        case "Sales And Marketing":
            return salesAndMarketingJson['task_1']
        case "Recruiting":
            return recruitingJson['task_1']
        case "Survey/Feedback":
            return surveyJson['task_1']
        case "VirtualRM":
            return virtualRMJson['task_1']
        case "Coaching":
            return coachingJson['task_1']
        case "Other":
            return otherJson['task_1']

    }
}
function BasicConfiguration({ formData, onFormDataChange }) {
    //console.log(`INitial form data ${JSON.stringify(formData)}`)
    const handleChange = (event) => {
        //console.log(`NAME ${event.target.name}`);
        if (event.target.name === 'assistantTask') {
            Mixpanel.track('assistantTask', {
              item: event.target.value
            });
            onFormDataChange({
                ...formData, basicConfig: { ...formData.basicConfig, [event.target.name]: event.target.value }, rulesConfig: { ...formData.rulesConfig, prompts: { ...getPrefilledTemplate(event.target.value) } }
            });
            return

        } else if (event.target.name === 'assistantType') {
            Mixpanel.track('assistantType', {
              item: event.target.value
            });
            if (event.target.value == "IVR") {
                var newFormData = { ...formData }
                newFormData.modelsConfig.llmConfig.model = "gpt-3.5-turbo-1106"
                onFormDataChange({
                    ...newFormData, basicConfig: { ...newFormData.basicConfig, [event.target.name]: event.target.value }
                });
                return
            }
        }

        onFormDataChange({
            ...formData, basicConfig: { ...formData.basicConfig, [event.target.name]: event.target.value }
        });

    };

    const handleRadioChange = (event) => {
        Mixpanel.track('assistantInvocation', {
          item: event.target.value
        });
        let engagementConfig = {}

        engagementConfig = {
            "channel": event.target.value,
            "format": "wav"
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
                        label="Agent Name"
                        variant="outlined"
                        name="assistantName"
                        value={formData.basicConfig.assistantName || 'My Agent'}
                        onChange={handleChange}
                    />
                </FormControl>
                {renderTooltip("Agents will refer to themselves with this name")}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginY: 1 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="assistant-type-label">Agent style</InputLabel>
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
                {renderTooltip('"Free flowing" mimics a natural conversation while "IVR" sticks to a pre-defined script.')}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginY: 1 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="task-label">Primary Task</InputLabel>
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
                        <MenuItem value="Coaching"> Coaching </MenuItem>
                        <MenuItem value="VirtualRM"> Virtual Relationship Manager </MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
                {renderTooltip("Your prompt template will be built according to the agent’s primary task. You do not need to stick to this task")}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', marginY: 1 }}>
                <FormControl component="fieldset" fullWidth margin="normal">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold', marginRight: 2 }}>
                            Agent Invocation
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
                        {renderTooltip("How will the agent be invoked - through an outgoing phone call or via your system connecting using a websocket")}
                    </Box>
                </FormControl>
            </Box>

        </Box>
    );
}

export default BasicConfiguration;
