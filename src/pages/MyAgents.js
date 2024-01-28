import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import JsonTable from '../components/Table'; // Adjust the import path as necessary
import Backdrop from '@mui/material/Backdrop';
import createApiInstance from '../utils/api';


function MyAgents({ accessToken, userId }) {
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const api = createApiInstance(accessToken);

    useEffect(() => {
        const fetchAgents = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/agents`);
                setAgents(response.data);
            } catch (error) {
                console.error('Error fetching agents: Making loading false', error);
                setIsLoading(false)
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (accessToken) {
            fetchAgents();
        }
    }, [accessToken]);


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
                        <JsonTable sx={{ width: '70%' }} jsonData={agents} userId={userId} columnsToShow={["agent_name", "agent_type", "agent_status", "updated_at", "created_at"]} onClickPage={"agent-details"} clickable={true} headersDisplayedAs={["Agent Name", "Agent Task", "Agent Status", "Last Updated", "Created On"]} />
                    </Box>
                )
            }
        </Box>
    );
}

export default MyAgents;
