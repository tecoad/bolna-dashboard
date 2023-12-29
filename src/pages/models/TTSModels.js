import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import JsonTable from '../../components/Table';
import axios from 'axios';

function TTSModels({ voices }) {

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant='h4' gutterBottom>
                My Voices
            </Typography>
            <JsonTable jsonData={voices} columnsToShow={["name", "provider", "model", "accent", "lowLatency"]} onClickPage={null} headersDisplayedAs={["Voice", "Provider", "Model", "Accent", "Low Latency"]} clickable={false} />

        </Box>
    );
}

export default TTSModels;
