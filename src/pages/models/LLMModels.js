import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import JsonTable from '../../components/Table';

function LLMModels({ llmModels }) {
    console.log(`llm_models ${JSON.stringify(llmModels)}`)
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4' gutterBottom> LLM Models </Typography>
            <Typography variant='body1'>
                <a href='https://calendly.com/bolna/30min' target='_blank'>
                    Reach out to us
                </a> if you would like to use our orchestration platform for finetuned LLM Models
            </Typography>

            <JsonTable jsonData={llmModels} columnsToShow={["display_name", "languages", "json_mode"]} onClickPage={null} headersDisplayedAs={["Model Name", "Language", "IVR Compatible"]} clickable={false} />

        </Box>
    );
}

export default LLMModels;
