import React from 'react';
import { Box } from '@mui/material';
import JsonTable from '../../components/Table'; // Adjust the import path as necessary
import runData from '../../data/fake_run_details.json'; // Adjust the import path as necessary

function RunTable() {
    return (
        <Box>
            <JsonTable
                sx={{ width: '70%' }}
                jsonData={runData}
                columnsToShow={["run_id", "run_duration", "run_date", "total_cost"]}
                onClickPage="run-details"
            />
        </Box>
    );
}

export default RunTable;
