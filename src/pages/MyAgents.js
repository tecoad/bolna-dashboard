import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import JsonTable from '../components/Table'; // Adjust the import path as necessary
import Backdrop from '@mui/material/Backdrop';

function MyAgents({ userId }) {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgents = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/assistants?user_id=${userId}`);
                setAgents(response.data);
            } catch (error) {
                console.error('Error fetching agents: Making loading false', error);
                setIsLoading(false)
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchAgents();
        }
    }, [userId]);


    if (error) {
        return <Typography>Error loading agents.</Typography>;
    }

    return (
        <Box>
            <Typography textAlign={'left'} variant='h3' gutterBottom> My Agents </Typography >
            {
                isLoading ? (
                    <Backdrop
                        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
                        open={isLoading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                ) : (
                    <Box>
                        <JsonTable sx={{ width: '70%' }} jsonData={agents} columnsToShow={["assistant_name", "assistant_type", "assistant_status", "updated_at", "created_at"]} userId={userId} onClickPage={"agent-details"} clickable={true} headersDisplayedAs={["Assistant Name", "Assistant Task", "Assistant Status", "Last Updated", "Created On"]} />
                    </Box>
                )
            }
        </Box>
    );
}

export default MyAgents;
