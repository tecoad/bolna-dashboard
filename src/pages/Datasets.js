import React from 'react';
import { Box } from '@mui/material';

function Datasets() {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <h1> Datasets </h1>
        </Box>
    );
}

export default Datasets;
