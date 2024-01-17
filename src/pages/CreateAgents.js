import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AgentFormStepper from '../components/AgentFormStepper';
import { CREATE_AGENT_FORM } from '../utils/utils';

function CreateAgents({ accessToken }) {
    return (

        <Box>

            {
                (
                    <>
                        <Box>
                            <AgentFormStepper initialData={{ ...CREATE_AGENT_FORM }} isUpdate={false} accessToken={accessToken} />
                        </Box>
                    </>
                )
            }
        </Box>
    );
}

export default CreateAgents;
