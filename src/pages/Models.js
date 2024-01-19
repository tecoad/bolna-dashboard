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
import createApiInstance from '../utils/api';

function Models({ accessToken }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [openVoiceLabs, setOpenVoiceLabs] = useState(false);
    const [activeTab, setActiveTab] = useState(0)
    const [voices, setVoices] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [llmModels, setLLMModels] = useState(null);
    const api = createApiInstance(accessToken);

    const handleOpenVoiceLabs = () => {
        setOpenVoiceLabs(true);
    };

    const handleCloseVoiceLabs = () => {
        setOpenVoiceLabs(false);
    };

    useEffect(() => {
        const fetchModels = async () => {
            setIsLoading(true);
            try {
                //const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/get_voices?user_id=${userId}`);
                const response = await api.get('/get_all_voices');
                setVoices(response.data.voices);
                setLLMModels(response.data.llmModels);
                console.log(`Voices ${JSON.stringify(response.data)}`)
            } catch (error) {
                console.error('Error fetching agents:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (accessToken) {
            fetchModels();
        }

    }, [accessToken]);

    const tabsData = [
        { name: 'TTS', component: <TTSModels voices={voices} /> },
        { name: 'LLM', component: <LLMModels llmModels={llmModels} /> },
        { name: 'ASR', component: <ASRModels /> },
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
                            activeTab == 0 ? (
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

                    {/* Dialog for Voice Lab */}
                    <Dialog open={openVoiceLabs} onClose={handleCloseVoiceLabs} fullWidth maxWidth="md">
                        <VoiceLab voices={voices} accessToken={accessToken} setVoices={setVoices} defaultValue={voices[0]} />
                    </Dialog>
                </>
            )}

        </Box>
    );
}

export default Models;
