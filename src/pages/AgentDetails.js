import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog } from '@mui/material';
import CustomTabs from '../components/CustomTabs';
import Analytics from './assistant-details/Analytics';
import RunsTable from './assistant-details/RunsTable';
import RequestLogs from './assistant-details/RequestLogs';
import ChatComponent from '../components/ChatComponent'; // Import your ChatComponent

function AgentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const agent = location.state?.agent;
    const userId = location.state?.userId;
    const [openPlayground, setOpenPlayground] = useState(false);
    const agentId = agent?.range.split("#")[1]
    const handlePlaygroundOpen = () => {
        setOpenPlayground(true);
    };

    const handlePlaygroundClose = () => {
        setOpenPlayground(false);
    };

    const tabsData = [
        { name: 'Analytics', component: <Analytics /> },
        { name: 'Agent Execution', component: <RunsTable /> },
        { name: 'Request Logs', component: <RequestLogs /> },
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">Agent Details</Typography>
                <Box>
                    <Button onClick={() => navigate('/dashboard/my-agents')}
                        sx={{ marginRight: 2, backgroundColor: '#f5f5f5', color: 'black', '&:hover': { backgroundColor: '#e0e0e0' } }}
                    >
                        Back to My Agents
                    </Button>
                    <Button
                        onClick={handlePlaygroundOpen}
                        sx={{ backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                    >
                        Playground
                    </Button>
                </Box>
            </Box>
            <CustomTabs tabsData={tabsData} orientation={"horizontal"} />

            {/* Dialog for Playground */}
            <Dialog open={openPlayground} onClose={handlePlaygroundClose} fullWidth maxWidth="md">
                <ChatComponent agentId={agentId} userId={userId} isOpen={openPlayground} />
            </Dialog>
        </Box>
    );
}

export default AgentDetails;
