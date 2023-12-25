import React from 'react';
import { Box, Typography, Divider, Grid, Paper, AudioPlayer } from '@mui/material';

function ExecutionMetadata({ executionDetails }) {
    console.log(`${JSON.stringify(executionDetails)}`)
    const DetailItem = ({ title, content }) => (
        <Box display="flex" justifyContent="space-between" my={1}>
            <Typography variant="subtitle1">{title}:</Typography>
            <Typography variant="body1">{typeof content === 'object' ? JSON.stringify(content) : content}</Typography>
        </Box>
    );

    const renderSection = (title, details) => (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            {Object.entries(details).map(([key, value]) => {
                // Check if value is an object and handle it accordingly
                if (typeof value === 'object' && value !== null) {
                    return (
                        <Box key={key} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                {key}:
                            </Typography>
                            {Object.entries(value).map(([subKey, subValue]) => (
                                <DetailItem key={subKey} title={subKey} content={subValue} />
                            ))}
                        </Box>
                    );
                }
                return <DetailItem key={key} title={key} content={value} />;
            })}
        </Box>
    );

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'row', gap: 2 }}>
            {/* Left Side */}
            <Box flex={1}>
                {renderSection("Metadata", {
                    "Run ID": executionDetails.run_id,
                    "Run Duration": `${executionDetails.run_duration} seconds`,
                    "Run Date": executionDetails.run_date,
                    "Total Cost": `$${executionDetails.total_cost}`
                })}
                {renderSection("Usage Breakdown", executionDetails.usageBreakdown)}
                {renderSection("Follow-Up Task Details", executionDetails['followup-task details'])}
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Right Side */}
            <Box flex={2} sx={{ pl: 2 }}>
                <Typography variant='h6'>Transcript & Recording</Typography>
                <audio controls src={executionDetails.recording} style={{ width: '100%' }}>
                    Your browser does not support the audio element.
                </audio>
                <Paper elevation={2} sx={{ mt: 2, p: 2, maxHeight: '300px', overflow: 'auto' }}>
                    <Typography variant="body1">
                        {executionDetails.transcript}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}



export default ExecutionMetadata;
