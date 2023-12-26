import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, CircularProgress } from '@mui/material';
import CustomTabs from '../components/CustomTabs';
import ChatComponent from '../components/ChatComponent'; // Import your ChatComponent
import { convertToCreateAgentForm, convertToText } from '../utils/utils';
import axios from 'axios';
import ASRModels from './models/ASRModels';
import TTSModels from './models/TTSModels';
import LLMModels from './models/LLMModels';
import VoiceLab from './models/VoiceLab';

function Models() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;
    const [loading, setLoading] = useState(false);
    const [openVoiceLabs, setOpenVoiceLabs] = useState(false);
    const [activeTab, setActiveTab] = useState(0)

    const handleOpenVoiceLabs = () => {
        setOpenVoiceLabs(true);
    };

    const handleCloseVoiceLabs = () => {
        setOpenVoiceLabs(false);
    };
    useEffect(() => {
    }, [userId]);


    const tabsData = [
        { name: 'ASR', component: <ASRModels /> },
        { name: 'LLM', component: <LLMModels /> },
        { name: 'TTS', component: <TTSModels /> },
    ];

    return (
        <Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">Model Details</Typography>
                        {
                            activeTab == 2 ? (
                                <Box>
                                    <Button
                                        onClick={handleOpenVoiceLabs}
                                        sx={{ backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                                    >
                                        Voice Lab
                                    </Button>
                                </Box>
                            ) : null
                        }

                    </Box>
                    <CustomTabs tabsData={tabsData} orientation={"horizontal"} setActiveTabInParent={setActiveTab} />

                    {/* Dialog for Voice Lab     */}
                    <Dialog open={openVoiceLabs} onClose={handleCloseVoiceLabs} fullWidth maxWidth="md">
                        <VoiceLab />
                    </Dialog>
                </>
            )}

        </Box>
    );
}

export default Models;
