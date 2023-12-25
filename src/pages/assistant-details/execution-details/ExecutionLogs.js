import React from 'react';
import { Box, Typography } from '@mui/material';

function ExecutionLogs() {


    return (
        <Box sx={{ display: 'flex' }}>
            <h1> Execution logs </h1>
            <Typography variant='body'> Execution logs for data flow across models will be displayed here </Typography>
        </Box>
    );
}

export default ExecutionLogs;
