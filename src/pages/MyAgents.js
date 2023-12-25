import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import JsonTable from '../components/Table'; // Adjust the import path as necessary
import Backdrop from '@mui/material/Backdrop';

function MyAgents({ session }) {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgents = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/assistants?user_id=${session.user.id}`);
                setAgents(response.data); // Assuming the response data is the array of agents
            } catch (error) {
                console.error('Error fetching agents:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session && session.user && session.user.id) {
            fetchAgents();
        }
    }, [session]);


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
                        <JsonTable sx={{ width: '70%' }} jsonData={agents} columnsToShow={["assistant_name", "assistant_type", "assistant_status"]} session={session} onClickPage={"agent-details"} />
                    </Box>
                )
            }
        </Box>
    );
}

export default MyAgents;
