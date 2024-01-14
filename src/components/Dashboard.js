import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Typography, Box, Toolbar, AppBar } from '@mui/material';
import { Menu as MenuIcon, AccountBox, GroupAdd, Dashboard as DashboardIcon, ExitToApp } from '@mui/icons-material';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group'; // Icon for "My Agents"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Icon for "Create Agents"
import InsightsIcon from '@mui/icons-material/Insights'; // Icon for "Models"
import StorageIcon from '@mui/icons-material/Storage'; // Icon for "Datasets"
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'; // Icon for "Integrations"
import AccountBoxIcon from '@mui/icons-material/AccountBox'; // Icon for "Account"
import VpnKeyIcon from '@mui/icons-material/VpnKey';


const drawerWidth = 240;

function Dashboard({ supabase }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logoutUser = () => {
        supabase.auth.signOut().then(() => {
            alert("Logged out")
            navigate("/");
        })

    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <ListItem button component={NavLink} to="my-agents">
                    <ListItemIcon><GroupIcon /></ListItemIcon>
                    <ListItemText primary="My Agents" />
                </ListItem>
                <ListItem button component={NavLink} to="create-agents">
                    <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                    <ListItemText primary="Create Agents" />
                </ListItem>
                <ListItem button component={NavLink} to="models">
                    <ListItemIcon><InsightsIcon /></ListItemIcon>
                    <ListItemText primary="Models" />
                </ListItem>
                <ListItem button component={NavLink} to="datasets">
                    <ListItemIcon><StorageIcon /></ListItemIcon>
                    <ListItemText primary="Datasets" />
                </ListItem>
                <ListItem button component={NavLink} to="integrations">
                    <ListItemIcon><SettingsInputComponentIcon /></ListItemIcon>
                    <ListItemText primary="Integrations" />
                </ListItem>
                <ListItem button component={NavLink} to="account">
                    <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                    <ListItemText primary="Account" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={NavLink} to="my-keys">
                    <ListItemIcon><VpnKeyIcon /></ListItemIcon>
                    <ListItemText primary="API Keys" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button key="Logout" onClick={logoutUser}>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    const pageTitle = useMemo(() => {
        const path = location.pathname.split("/").pop();
        switch (path) {
            case 'my-agents':
                return 'My Agents';
            case 'create-agents':
                return 'Create Agents';
            case 'models':
                return 'Models';
            case 'datasets':
                return 'Datasets';
            case 'integrations':
                return 'Integrations';
            case 'account':
                return 'Account';
            case 'my-keys':
                return 'APIKeys';
            default:
                return 'Dashboard';
        }
    }, [location]);


    return (
        <Box component="main" sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" noWrap>
                        {pageTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Dashboard;
