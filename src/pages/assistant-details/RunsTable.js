import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import JsonTable from '../../components/Table';
import fakeData from '../../data/fake_run_details.json';
import createApiInstance from '../../utils/api';


function RunTable({ accessToken }) {
    const location = useLocation();
    const [runData, setRunData] = useState([]);
    const [loading, setLoading] = useState(false);
    const agent = location.state?.agent;
    const agentId = agent?.range.split("#")[1];
    const api = createApiInstance(accessToken);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/agent/executions?agent_id=${agentId}`);
                var runs = [...response.data.data]
                setRunData(runs);
                setLoading(false);
                console.log(`Got all executions and this is run data ${JSON.stringify(runData)}`)

            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };
        fetchData();
    }, [agentId, accessToken]); // Empty dependency array ensures this effect runs once on component mount


    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <JsonTable
                    sx={{ width: '70%' }}
                    jsonData={runData || []}
                    columnsToShow={["range", "conversation_time", "createdAt", "total_cost"]}
                    onClickPage="run-details"
                    clickable={true}
                    headersDisplayedAs={["Run ID", "Run Duration", "Run Date", "Total Cost"]}
                    agent={agent}
                />
            )}
        </Box>
    );
}

export default RunTable;
