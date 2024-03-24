import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Backdrop, CircularProgress } from '@mui/material';
import JsonTable from '../../../components/Table';
import createApiInstance from '../../../utils/api';


function ExecutionLogs({ accessToken, runId }) {
    const [executionLogs, setExecutionLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    console.log(accessToken);
    console.log(runId);
    const api = createApiInstance(accessToken);

    useEffect(() => {
        const fetchExecutionLogs = async () => {
            setIsLoading(true);
            try {
                let [agentId, executionId] = runId.split('#');
                const response = await api.get(`/agent/${agentId}/execution/${executionId}/log`);
                setExecutionLogs(response.data.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExecutionLogs();
    }, [accessToken]);


    if (error) {
        return <Typography>Error loading logs.</Typography>;
    }

    return (
        <Box>
            <Typography textAlign={'left'} variant='h4' gutterBottom> Execution Logs </Typography >
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
                        <JsonTable
                        sx={{ width: '70%' }}
                        jsonData={executionLogs}
                        columnsToShow={["Time", "Data", "Direction", "Component", "Model"]}
                        headersDisplayedAs={["Timestamp", "Data", "Direction", "Component", "Model"]}
                        />
                    </Box>
                )
            }
        </Box>
    );
}

export default ExecutionLogs;
