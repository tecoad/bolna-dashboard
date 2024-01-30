import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import JsonTable from '../../../components/Table';

function ExecutionLogs({ session }) {
    const [logs, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchExecutionLogs = async () => {
    //         setIsLoading(true);
    //         try {
    //             const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/get_execution_logs?user_id=1`);
    //             setAgents(response.data.execution_run_logs);
    //         } catch (error) {
    //             console.error('Error fetching logs:', error);
    //             setError(error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchExecutionLogs();
    // }, [session]);


    if (error) {
        return <Typography>Error loading logs.</Typography>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4'> Execution Logs </Typography>
            <Typography variant='body1'>
                Coming soon
            </Typography>

        </Box>
    );
}

export default ExecutionLogs;
