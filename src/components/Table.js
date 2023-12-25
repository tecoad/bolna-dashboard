import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatHeader(header, row) {
    if (header.includes("_")) {
        return header.split('_').map(capitalizeFirstLetter).join(' ');
    }
    return header
}

function JsonTable({ jsonData, columnsToShow, session, onClickPage }) {
    const navigate = useNavigate();

    const handleRowClick = (row) => {
        if (onClickPage == "agent-details") {
            navigate("/dashboard/agent-details", { state: { agent: row, userId: session.user.id } });
        } else {
            console.log(`Row ${JSON.stringify(row)}`)
            navigate("/dashboard/agent/run-details", { state: { runDetails: row } });
        }

    };

    return (
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', backgroundColor: '#fff' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columnsToShow.map((column) => (
                            <TableCell key={column} sx={{ fontWeight: 'bold', color: 'grey[900]' }}>
                                {formatHeader(column, jsonData[0])}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {jsonData.map((row, index) => (
                        <TableRow onClick={() => handleRowClick(row)} key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, '&:nth-of-type(even)': { backgroundColor: '#fff' }, '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#e0e0e0' } }}>
                            {columnsToShow.map((column) => (
                                <TableCell key={column}>{row[column]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default JsonTable;
