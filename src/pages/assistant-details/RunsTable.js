import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import JsonTable from '../../components/Table';
//import runData from '../../data/fake_run_details.json';

function RunTable({ }) {
    const location = useLocation();
    const [runData, setRunData] = useState(null);
    const agent = location.state?.agent;
    const userId = location.state?.userId;
    const agentId = agent?.range.split("#")[1];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/assistant/executions?user_id=${userId}&assistant_id=${agentId}`);
                setRunData(response.data.runs);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [agentId, userId]); // Empty dependency array ensures this effect runs once on component mount


    return (
        <Box>
            {runData ? (
                <JsonTable
                    sx={{ width: '70%' }}
                    jsonData={runData}
                    columnsToShow={["range", "conversation_time", "run_date", "transcriber_characters"]}
                    onClickPage="run-details"
                    clickable={true}
                    headersDisplayedAs={["Run ID", "Run Duration", "Run Date", "Total Cost"]}
                    agent={agent}
                />
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );
}

export default RunTable;
