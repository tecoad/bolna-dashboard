import React from 'react';
import { Box, Typography } from '@mui/material';

function ExecutionLogs() {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4'> Execution Logs </Typography>
            <Typography variant='body1'>
                Execution logs for data flow across models will be displayed here
            </Typography>

        </Box>
    );
}

export default ExecutionLogs;
