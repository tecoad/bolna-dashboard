import React from 'react';
import { TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Box } from '@mui/material';

function FollowUpTasks({ formData, onFormDataChange }) {
    const handleChange = (event) => {
        onFormDataChange({ [event.target.name]: event.target.value });
    };

    // Tasks and a grid where we can add new tasks. Each task as task type - Extraction, Summarize, SMS, What'sapp, calendar invite something else  
    // Enable automated rescheduling of the call  
    return (
        <Box>
            <Typography variant='h4'> Follow up tasks </Typography>
            <Typography variant='caption'> Coming soon </Typography>

        </Box>
    );
}

export default FollowUpTasks;
