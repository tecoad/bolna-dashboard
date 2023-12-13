import React from 'react';
import { Box, Typography } from '@mui/material';
import AgentFormStepper from '../components/AgentFormStepper';
import { CREATE_AGENT_FORM } from '../utils/utils';
function CreateAgents({ session }) {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box>
            <Typography textAlign={'left'} variant='h3' gutterBottom> Create Agents </Typography >
            <Box>
                <AgentFormStepper initialData={{ ...CREATE_AGENT_FORM }} userId={session.user.id} isUpdate={false} />
            </Box>

        </Box>
    );
}

export default CreateAgents;
