import React from 'react';
import { Box, Typography } from '@mui/material';

function ASRModels() {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4'> ASR Models </Typography>
            <Typography variant='body1'>
                This will basically include a list of finetuned ASRs user has.
                <br />
                <a href='https://calendly.com/bolna/30min' target='_blank'>
                    Reach out to us
                </a> if you would like to use our orchestration platform finetuned ASR Models

            </Typography>

        </Box>
    );
}

export default ASRModels;
