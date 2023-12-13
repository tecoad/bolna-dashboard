import React from 'react';
import { Box } from '@mui/material';

function Integrations() {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <h1> Integrations </h1>
        </Box>
    );
}

export default Integrations;
