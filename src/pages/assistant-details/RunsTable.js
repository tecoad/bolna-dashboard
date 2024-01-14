import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import JsonTable from '../../components/Table';
import fakeData from '../../data/fake_run_details.json';

function RunTable({ }) {
    const location = useLocation();
    const [runData, setRunData] = useState([]);
    const [loading, setLoading] = useState(false);
    const agent = location.state?.agent;
    const userId = location.state?.userId;
    const agentId = agent?.range.split("#")[1];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/agent/executions?user_id=${userId}&assistant_id=${agentId}`);
                var runs = []
                if (response.data && response.data.runs && response.data.runs.length > 0) {
                    runs = [...response.data.runs];
                }
                setRunData(runs);
                setLoading(false);
                console.log(`Got all executions and this is run data ${JSON.stringify(runData)}`)

            } catch (error) {
                console.error('Error fetching data:', error);
            }

        };
        fetchData();
    }, [agentId, userId]); // Empty dependency array ensures this effect runs once on component mount


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
