import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Divider, Paper, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


function Analytics() {
    const location = useLocation();
    const navigate = useNavigate();
    const agent = location.state?.agent;
    const userId = location.state?.userId;

    const [analyticsData, setAnalyticsData] = useState({
        "extraction_details": { "value_1": 30, "value_2": 24, "value_3": 10 },
        "cost_details": {
            "average_transcriber_cost_per_conversation": 1.2,
            "average_llm_cost_per_conversation": 1.1,
            "average_synthesizer_cost_per_conversation": 1.0
        },
        "top_graphs": {
            number_of_conversations_in_past_5_days: [100, 93, 91, 120, 81],
            cost_past_5_days: [400, 380, 391, 423, 200],
            average_duration_past_5_days: [59, 52, 63, 42, 55]
        },
        "call_details": {
            "finished_calls": 30,
            "not_picked_up": 52,
            "unfinished_calls": 10,
        },
        "execution_details": {
            "total_conversations": 100,
            "total_cost": 30,
            "Average duration of a caonversation": 52
        },
        "high_level_summarization": "High level summary from all the runs and transcript goes here",
    });

    // Uncomment it when you have the data
    // useEffect(() => {
    //     const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
    //     axios.get(`${API_ENDPOINT}/assistant/analytics?user_id=${userId}&assistant_id=${agentId}`)
    //         .then(response => {
    //             setAnalyticsData(response.data.analytics);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching analytics data:', error);
    //         });
    // }, []);


    const formatTitle = (title) => {
        return title.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderCard = (title, value) => (
        <Grid item xs={12} sm={12} md={4}>
            <Paper elevation={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ flexGrow: 1, padding: 2, textAlign: 'center' }}>
                    <Typography variant="h4">{value}</Typography> {/* Larger Typography for value */}
                    <Typography variant="h6">{formatTitle(title)}</Typography> {/* Smaller Typography for title */}
                </Box>
            </Paper>
        </Grid>
    );
    const ChartContainer = ({ children }) => (
        <div style={{ height: '300px' }}> {/* Adjust the height as needed */}
            {children}
        </div>
    );

    const renderBarChart = (data, label) => {
        const chartData = {
            labels: Object.keys(data),
            datasets: [
                {
                    label: formatTitle(label),
                    data: Object.values(data),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };

        return (
            <ChartContainer>
                <Bar data={chartData} height={"220px"} />
            </ChartContainer>
        );
    };

    const renderPieChart = (data, title) => {
        const chartData = {
            labels: Object.keys(data),
            datasets: [
                {
                    label: formatTitle(title),
                    data: Object.values(data),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                    ],
                },
            ],
        };

        const chartOptions = {
            plugins: {
                legend: {
                    position: 'bottom',
                },
            },
        };

        return (
            <ChartContainer>
                <Pie data={chartData} options={chartOptions} />
            </ChartContainer>
        );
    };


    return (
        <Box sx={{ p: 3 }}>
            {/* First Row */}
            <Grid container spacing={2}>
                {Object.entries(analyticsData.execution_details).map(([key, value]) =>
                    renderCard(key, value)
                )}
            </Grid>

            {/* Second Row */}
            <Box sx={{ my: 4 }}>
                <Grid container spacing={2}>
                    {Object.entries(analyticsData.top_graphs).map(([key, value]) => (
                        <Grid item xs={12} sm={12} md={4} key={key}>
                            {renderBarChart(value, key)}
                        </Grid>
                    ))}
                    {analyticsData.cost_details && (
                        <Grid item xs={12} sm={4} md={4}>
                            {renderPieChart(analyticsData.cost_details, 'Cost Details')}
                        </Grid>
                    )}
                    {analyticsData.extraction_details && (
                        <Grid item xs={12} sm={4} md={4}>
                            {renderPieChart(analyticsData.extraction_details, 'Extraction Details')}
                        </Grid>
                    )}
                    {analyticsData.call_details && (
                        <Grid item xs={12} sm={4} md={4}>
                            {renderPieChart(analyticsData.call_details, 'Call Details')}
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Third Row */}
            <Box sx={{ my: 4 }}>
                <Typography variant="h5">High Level Summary</Typography>
                <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography variant="body1">
                        {analyticsData.high_level_summarization}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}


export default Analytics;
