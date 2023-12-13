import React from 'react';
import { Box } from '@mui/material';

function Models() {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <h1> Models </h1>
        </Box>
    );
}

export default Models;
