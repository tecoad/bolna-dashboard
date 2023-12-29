import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import JsonTable from '../../components/Table';
import axios from 'axios';

function TTSModels({ session }) {

    const [voices, setVoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModels = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/user/voices?user_id=${session.user.id}`);
                setVoices(response.data);
                console.log(`Voices ${JSON.stringify(response.data)}`)
            } catch (error) {
                console.error('Error fetching agents:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session && session.user && session.user.id) {
            fetchModels();
        }

    }, [session]);


    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4' gutterBottom>
                My Voices
            </Typography>
            {
                isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <JsonTable jsonData={voices} columnsToShow={["name", "provider", "model", "accent", "lowLatency"]} onClickPage={null} headersDisplayedAs={["Voice", "Provider", "Model", "Accent", "Low Latency"]} clickable={false} />
                    </>
                )
            }
        </Box>
    );
}

export default TTSModels;
