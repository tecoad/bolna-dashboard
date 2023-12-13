import React from 'react';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

function FollowUpTasks({ formData, onFormDataChange }) {
    const handleChange = (event) => {
        onFormDataChange({ [event.target.name]: event.target.value });
    };

    // Tasks and a grid where we can add new tasks. Each task as task type - Extraction, Summarize, SMS, What'sapp, calendar invite something else  
    // Enable automated rescheduling of the call  
    return (
        <form>
            <TextField
                label="Name of Agent"
                variant="outlined"
                name="agentName"
                value={formData.agentName || ''}
                onChange={handleChange}
            />
            {/* Add other fields for step 1 */}
        </form>
    );
}

export default FollowUpTasks;
