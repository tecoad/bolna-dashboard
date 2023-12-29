import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AgentFormStepper from '../components/AgentFormStepper';
import { CREATE_AGENT_FORM } from '../utils/utils';
import axios from 'axios';

function CreateAgents({ session }) {

    const [voices, setVoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchModels = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/user/voices?user_id=${session.user.id}`);
                setVoices(response.data);
                console.log(`Voices ${JSON.stringify(response.data)}`)
            } catch (error) {
                console.error('Error fetching agents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session && session.user && session.user.id) {
            fetchModels();
        }

    }, [session]);

    return (

        <Box>

            {
                isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Typography textAlign={'left'} variant='h3' gutterBottom> Create Agents </Typography >
                        <Box>
                            <AgentFormStepper initialData={{ ...CREATE_AGENT_FORM }} userId={session?.user?.id} isUpdate={false} />
                        </Box>
                    </>
                )
            }
        </Box>
    );
}

export default CreateAgents;
