import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import JsonTable from '../../components/Table';
import createApiInstance from '../../utils/api';


function BatchDetails({ accessToken }) {
    const location = useLocation();
    const [batchData, setBatchData] = useState([]);
    const [loading, setLoading] = useState(false);
    const agentId = location.state?.agentId;
    const batchId = location.state?.runDetails?.batch_id;
    const api = createApiInstance(accessToken);

    useEffect(() => {
        const fetchBatchDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/batches/details?agent_id=${agentId}&batch_id=${batchId}`);
                var batchData = [...response.data]
                setBatchData(batchData);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };
        fetchBatchDetails();
    }, [agentId, accessToken]);


    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <JsonTable
                    sx={{ width: '70%' }}
                    jsonData={batchData || []}
                    columnsToShow={["callee", "status", "updated_at", "retried"]}
                    clickable={false}
                    headersDisplayedAs={["Callee", "Call Status", "Last Updated", "Times Retried"]}
                />
            )}
        </Box>
    );
}

export default BatchDetails;
