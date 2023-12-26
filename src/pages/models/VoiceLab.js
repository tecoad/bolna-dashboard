import React from 'react';
import { Box, Typography } from '@mui/material';

function VoiceLab() {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4' gutterBottom>
                Voice Lab
            </Typography>
            <Typography variant='body1'>
                This is the place where user will be able to choose a voice from the dropdown and try the voice out. If user likes the voice, they can add it to their voices.
            </Typography>
        </Box>
    );
}

export default VoiceLab;
