import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
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

        if (accessToken) {
            fetchData();
        }

    }, [agentId, accessToken]); // Empty dependency array ensures this effect runs once on component mount


    return (
        <Box>
            {loading ? (
                <p>Loading...</p>
            ) : (

                <>
                {runData && runData.length > 0 ? (
                    <>
                        <Typography variant="body2" gutterBottom>
                            This displays all the agent executions (including Call Me & Playground)
                        </Typography>

                        <JsonTable
                            sx={{ width: '70%' }}
                            jsonData={runData}
                            columnsToShow={["range", "conversation_time", "createdAt", "total_cost"]}
                            onClickPage="run-details"
                            clickable={true}
                            headersDisplayedAs={["Run ID", "Run Duration", "Run Date", "Total Credits Used"]}
                            agent={agent}
                            dateColumns={["createdAt"]}
                        />

                    </>

                    ) : (
                    <Typography variant="body1" gutterBottom>
                        Use Playground or Call Me to interact with your created agent. <br/>
                        All interactions can be found in the Analytics tab.
                    </Typography>
                )}

            </>
            )}
        </Box>
    );
}

export default RunTable;
