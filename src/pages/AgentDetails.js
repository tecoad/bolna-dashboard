import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, CircularProgress, DialogTitle, DialogContent } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import CustomTabs from '../components/CustomTabs';
import Analytics from './assistant-details/Analytics';
import RunsTable from './assistant-details/RunsTable';
import RequestLogs from './assistant-details/RequestLogs';
import BatchCall from './assistant-details/BatchCall';
import ChatComponent from '../components/ChatComponent'; // Import your ChatComponent
import CallComponent from '../components/CallComponent'; // Import your CallComponent
import AgentFormStepper from '../components/AgentFormStepper';
import { convertToCreateAgentForm, convertToText } from '../utils/utils';
import createApiInstance from '../utils/api';

function AgentDetails({ accessToken }) {
    const location = useLocation();
    const navigate = useNavigate();
    const agent = location.state?.agent;
    var [formData, setFormData] = useState(convertToCreateAgentForm(agent))
    //console.log(`Agent details ${JSON.stringify(agent)}`)
    const userId = location.state?.userId;
    const [openPlayground, setOpenPlayground] = useState(false);
    const agentId = agent?.range.split("#")[1];
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState(null);
    const { handleClick } = CallComponent({ agentId, accessToken });
    const [activeTab, setActiveTab] = useState(0);
    const api = createApiInstance(accessToken);

    const [openAnalyticsDialog, setOpenAnalyticsDialog] = useState(false);

    useEffect(() => {
        const fetchPromptData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/agent/prompts?agent_id=${agentId}`);

                // Create a new object for formData
                var newFormData = { ...formData };

                if (newFormData.basicConfig.assistantType == "FreeFlowing") {
                    setFormData({ ...formData, rulesConfig: { ...formData.rulesConfig, prompts: { ...response.data.data['task_1'] } } });
                    newFormData = { ...formData, rulesConfig: { ...formData.rulesConfig, prompts: { ...response.data.data['task_1'] } } }
                    console.log(`Everything is free flowing ${JSON.stringify(newFormData)}`)

                } else {
                    setFormData({ ...formData, rulesConfig: { ...formData.rulesConfig, graph: { ...response.data.data['task_1'] } } });
                    newFormData = { ...formData, rulesConfig: { ...formData.rulesConfig, graph: { ...response.data.data['task_1'] } } }
                    console.log(`ivr based ${JSON.stringify(newFormData)}`)
                }

                // Log the updated formData
                console.log(`Updated formData ${JSON.stringify(newFormData)}`);

            } catch (error) {
                console.error('Error fetching prompt data:', error);
            }
            setLoading(false);
        };

        if (accessToken) {
            fetchPromptData();
        }

    }, [accessToken, agentId, userId]);


    const handlePlaygroundOpen = () => {
        setOpenPlayground(true);
    };

    const handlePlaygroundClose = () => {
        setOpenPlayground(false);
    };

    const tabsData = [
        { name: 'Analytics', component: <Analytics accessToken={accessToken} agentId={agentId} /> },
        { name: 'Agent Execution', component: <RunsTable accessToken={accessToken} /> },
        { name: 'Edit agent details', component: <AgentFormStepper initialData={formData} isUpdate={true} agentId={agentId} accessToken={accessToken} /> },
        { name: 'Batch call', component: <BatchCall agentId={agentId} accessToken={accessToken} /> },
    ];

    return (
        <Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {activeTab < 3 && (
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4">Agent Details</Typography>
                            <Box>
                                <Button onClick={() => navigate('/dashboard/my-agents')}
                                    sx={{ marginRight: 2, backgroundColor: '#f5f5f5', color: 'black', '&:hover': { backgroundColor: '#e0e0e0' } }}
                                >
                                    Back to My Agents
                                </Button>
                                <Button
                                    onClick={handleClick}
                                    sx={{ marginRight: 2, backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                                >
                                    Call me
                                </Button>
                                <Button
                                    onClick={handlePlaygroundOpen}
                                    sx={{ backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                                >
                                    Playground
                                </Button>
                            </Box>
                        </Box>

                    )}
                    <CustomTabs tabsData={tabsData} orientation={"horizontal"} setActiveTabInParent={setActiveTab} setOpenAnalyticsDialog={setOpenAnalyticsDialog} />

                    {/* Dialog for Playground */}
                    <Dialog open={openPlayground} onClose={handlePlaygroundClose} fullWidth maxWidth="md">
                        <ChatComponent agentId={agentId} userId={userId} isOpen={openPlayground} accessToken={accessToken} />
                    </Dialog>

                    {/* Dialog for Analytics */}
                    <Dialog open={openAnalyticsDialog} onClose={() => setOpenAnalyticsDialog(false)} fullWidth maxWidth="md">
                        <DialogTitle>Rich Analuytcvis</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                Your agent analytics will appear here showing:
                            </Typography>
                            <List dense="true">
                            <ListItem>
                                <ListItemText primary="Conversations" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Cost" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Durations" />
                            </ListItem>
                            </List>
                        </DialogContent>
                    </Dialog>
                </>
            )}

        </Box>
    );
}

export default AgentDetails;
