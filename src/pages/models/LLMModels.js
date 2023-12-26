import React from 'react';
import { Box, Typography } from '@mui/material';

function LLMModels() {

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4' gutterBottom> LLM Models </Typography>
            <Typography variant='body1'>
                This will basically include a list of finetuned LLMs user has. LLMs can be finetuned to replace expensive prompts.
                <br />
                Reach out to us if you would like to use our orchestration platform finetuned LLM Models

            </Typography>

        </Box>
    );
}

export default LLMModels;
