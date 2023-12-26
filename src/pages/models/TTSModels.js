import React from 'react';
import { Box, Typography } from '@mui/material';

function TTSModels() {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4' gutterBottom>
                TTS Models
            </Typography>
            <Typography variant='body1'>
                This will basically include a list of voices user has included in their voices
            </Typography>
        </Box>
    );
}

export default TTSModels;
