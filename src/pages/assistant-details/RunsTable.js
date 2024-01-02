import React from 'react';
import { Box } from '@mui/material';
import JsonTable from '../../components/Table';
import runData from '../../data/fake_run_details.json';

function RunTable() {
    return (
        <Box>
            <JsonTable
                sx={{ width: '70%' }}
                jsonData={runData}
                columnsToShow={["run_id", "run_duration", "run_date", "total_cost"]}
                onClickPage="run-details"
                clickable={true}
                headersDisplayedAs={["Run ID", "Run Duration", "Run Date", "Total Cost"]}
            />
        </Box>
    );
}

export default RunTable;
