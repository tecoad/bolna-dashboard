import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AgentFormStepper from '../components/AgentFormStepper';
import { CREATE_AGENT_FORM } from '../utils/utils';
import axios from 'axios';

function CreateAgents({ userId }) {

    const [voices, setVoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchModels = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/user/voices?user_id=${userId}`);
                setVoices(response.data);
                console.log(`Voices ${JSON.stringify(response.data)}`)
            } catch (error) {
                console.error('Error fetching agents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchModels();
        }

    }, [userId]);

    return (

        <Box>

            {
                isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box>
                            <AgentFormStepper initialData={{ ...CREATE_AGENT_FORM }} userId={userId} isUpdate={false} />
                        </Box>
                    </>
                )
            }
        </Box>
    );
}

export default CreateAgents;
