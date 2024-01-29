import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, CircularProgress } from '@mui/material';
import CustomTabs from '../../components/CustomTabs';
import axios from 'axios';
import ExecutionMetadata from './execution-details/ExecutionMetadata';
import ExecutionLogs from './execution-details/ExecutionLogs';

function RunDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const runDetails = location.state?.runDetails;
    const [loading, setLoading] = useState(false);


    const tabsData = [
        { name: 'Execution Metadata', component: <ExecutionMetadata executionDetails={runDetails} /> },
        { name: 'Execution Logs', component: <ExecutionLogs />, badgeContent: 'Soon' },
    ];

    return (
        <Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Button onClick={() => navigate('/dashboard/my-agents')}
                                sx={{ marginRight: 2, backgroundColor: '#f5f5f5', color: 'black', '&:hover': { backgroundColor: '#e0e0e0' } }}
                            >
                                Back to My Agents
                            </Button>

                        </Box>
                    </Box>
                    <CustomTabs tabsData={tabsData} orientation={"horizontal"} />


                </>
            )}

        </Box>
    );
}

export default RunDetails;
