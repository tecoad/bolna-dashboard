import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import createApiInstance from '../utils/api';
import TextField from '@mui/material/TextField';
import EventIcon from '@mui/icons-material/Event';

import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatHeader(header, row) {
    if (header.includes("_")) {
        return header.split('_').map(capitalizeFirstLetter).join(' ');
    }
    return header
}

function JsonTable({
    jsonData,
    columnsToShow,
    tooltipMap,
    actionsToShow = {},
    userId,
    accessToken,
    onClickPage,
    clickable,
    headersDisplayedAs,
    agent
}) {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteApiUrl, setDeleteApiUrl] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = React.useState(dayjs());

    const api = createApiInstance(accessToken);


    const handleDateTimeChange = (newDateTime) => {
        // Handle the date-time change if needed
        setSelectedDateTime(newDateTime);
    };

    const handleDateTimeSubmit = async (callersListId, selectedDateTime, agentId) => {
        try {
            const formData = new FormData();
            formData.append('agent_id', agentId);
            formData.append('callers_list_id', callersListId);
            formData.append('scheduled_at', new Date(selectedDateTime).getTime() / 1000);

            const response = await api.post('/create_callers_list_batch', formData);

            if (response.status === 200) {
                console.log('Date & Time updated successfully');
                // You can add additional logic or feedback here
            } else {
                console.error('Failed to update Date & Time');
                // Handle the error or provide feedback to the user
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // Close the upload dialog
            window.location.reload();
        }
    };


    const handleDelete = async (accessToken, keyUuid, apiUrl) => {
        try {
            const response = await api.delete(`${apiUrl}/${keyUuid}`);

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
            setDeleteApiUrl(null);
        }
    };

    const handleDeleteClick = (keyUuid, apiUrl) => {
        // Show the delete confirmation dialog
        setDeleteDialogOpen(true);
        setDeleteTarget(keyUuid);
        setDeleteApiUrl(apiUrl);
    };

    const handleDeleteDialogClose = () => {
        // Close the delete confirmation dialog without deleting
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
        setDeleteApiUrl(null);
    };

    const handleRowClick = (row) => {
        if (clickable) {
            if (onClickPage == "agent-details") {
                navigate("/dashboard/agent-details", {
                    state: {
                        userId: userId,
                        agent: row
                    }
                });
            } else {
                console.log(`Row ${JSON.stringify(row)}`)
                navigate("/dashboard/agent/run-details", {
                    state: {
                        runDetails: row
                    }
                });
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

                            {Object.entries(actionsToShow).map(([key, value]) => {
                                if (key === 'Delete') {
                                    return (
                                        <TableCell key={row[value]}>
                                            {/* Render content for "earth" */}
                                            <IconButton onClick={() => handleDeleteClick(row[value.id], value.url)} aria-label={`${key} ${row[value.id]}`}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    );
                                } else if (key === 'Schedule') {
                                    return (

                                        <TableCell>
                                          {/* DateTimePicker */}

                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                localeText={{ okButtonLabel: 'Schedule' }}
                                            >

                                                {row[value.scheduled_at] !== '' ? (
                                                    <DateTimePicker
                                                        label="Schedule"
                                                        defaultValue={dayjs(row[value.scheduled_at])}
                                                        onChange={handleDateTimeChange}
                                                        onAccept={() => handleDateTimeSubmit(row[value.id], selectedDateTime, agent)}
                                                        disablePast={true}
                                                        slotProps={{
                                                            actionBar: {
                                                                actions: ["cancel", "accept"]
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <DateTimePicker
                                                        label="Schedule"
                                                        onChange={handleDateTimeChange}
                                                        onAccept={() => handleDateTimeSubmit(row[value.id], selectedDateTime, agent)}
                                                        disablePast={true}
                                                        slotProps={{
                                                            actionBar: {
                                                                actions: ["cancel", "accept"]
                                                            }
                                                        }}
                                                    />
                                                )}

                                            </LocalizationProvider>
                                        </TableCell>
                                    );
                                }

                                return null; // or any other default content
                            })}

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
                                    <Button onClick={() => handleDelete(accessToken, deleteTarget, deleteApiUrl)} color="primary" autoFocus>
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
