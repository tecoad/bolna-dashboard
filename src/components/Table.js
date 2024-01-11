import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import createApiInstance from '../utils/api';


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatHeader(header, row) {
    if (header.includes("_")) {
        return header.split('_').map(capitalizeFirstLetter).join(' ');
    }
    return header
}

function JsonTable({ jsonData, columnsToShow, tooltipMap, actionsToShow={}, userId, accessToken, onClickPage, clickable, headersDisplayedAs, agent }) {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const api = createApiInstance(accessToken);

    const handleDelete = async (accessToken, keyUuid) => {
        try {
            const response = await api.delete(`/delete_api_key/${keyUuid}`);

            if (response.data.state === "success") {
                window.location.reload();
            } else {
                console.error('Delete failed');
            }
        } catch (error) {
            console.error('Error while deleting:', error);
        } finally {
            // Close the delete confirmation dialog
            setDeleteDialogOpen(false);
            setDeleteTarget(null);
        }
    };

    const handleDeleteClick = (keyUuid) => {
        // Show the delete confirmation dialog
        setDeleteDialogOpen(true);
        setDeleteTarget(keyUuid);
    };

    const handleDeleteDialogClose = () => {
        // Close the delete confirmation dialog without deleting
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
    };

    const handleRowClick = (row) => {
        if (clickable) {
            if (onClickPage == "agent-details") {
                navigate("/dashboard/agent-details", { state: { agent: row, userId: userId } });
            } else {
                console.log(`Row ${JSON.stringify(row)}`)
                navigate("/dashboard/agent/run-details", { state: { runDetails: row } });
            }
        }
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none', backgroundColor: '#fff' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {headersDisplayedAs.map((column) => (
                            <TableCell key={column} sx={{ fontWeight: 'bold', color: 'grey[900]' }}>
                                {formatHeader(column, jsonData[0])}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {jsonData.map((row, index) => (
                        <TableRow onClick={() => handleRowClick(row)} key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, '&:nth-of-type(even)': { backgroundColor: '#fff' }, '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#e0e0e0' } }}>
                            {columnsToShow.map((column) => {
                                var name = row[column] == undefined ? "" : row[column]
                                if (tooltipMap && column in tooltipMap) {
                                    return (
                                        <Tooltip key={column} title={row[tooltipMap[column]].toString()} disableInteractive>
                                            <TableCell key={column}>{name.toString()}</TableCell>
                                        </Tooltip>
                                    )
                                } else {
                                    return (
                                        <TableCell key={column}>{name.toString()}</TableCell>
                                    )
                                }
                            })}

                            {Object.entries(actionsToShow).map(([key, value]) => (

                                <TableCell key={row[value]}>
                                    {/* Replace {key} with IconButton and DeleteIcon */}
                                    <IconButton onClick={() => handleDeleteClick(row[value])} aria-label={`Delete ${key}`}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            ))}

                            {/* Delete confirmation dialog */}
                            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this key?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleDeleteDialogClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={() => handleDelete(accessToken, deleteTarget)} color="primary" autoFocus>
                                        Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default JsonTable;
