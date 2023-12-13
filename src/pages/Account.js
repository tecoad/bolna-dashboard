import React from 'react';
import { Box } from '@mui/material';

function CreateAgents() {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <h1> CreateAgents </h1>
        </Box>
    );
}

export default CreateAgents;
