import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import JsonTable from '../../components/Table'; // Adjust the import path as necessary
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';
import createApiInstance from '../../utils/api';
import axios from 'axios';
import { CloudUpload } from '@mui/icons-material';



function BatchCall({ agentId, accessToken }) {
    const [batches, setBatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const api = createApiInstance(accessToken);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

    const handleUpload = async () => {
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('agent_id', agentId);

                const response = await api.post('/upload_callers_list', formData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (response.status === 200) {
                    console.log('File uploaded successfully!');
                } else {
                    console.error('Error uploading file.');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                // Close the upload dialog
                handleCloseUploadDialog();
                window.location.reload();
            }
        }
    };


    useEffect(() => {
        const fetchBatches = async (agentId) => {
            setIsLoading(true);
            try {
                const response = await api.get(`/get_callers_list?agent_id=${agentId}`);
                setBatches(response.data);
            } catch (error) {
                console.error('Error fetching agents: Making loading false', error);
                setIsLoading(false)
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (accessToken && agentId) {
            fetchBatches(agentId);
        }
    }, [accessToken, agentId]);


    if (error) {
        return <Typography>Error loading batches.</Typography>;
    }

    return (
        <Box>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">Batches</Typography>
                <Box>
                  <input
                    type="file"
                    id="file-input" // Added id attribute
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-input">

                    <Button
                        onClick={handleOpenUploadDialog}
                        sx={{ backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                    >
                        Upload new callers list
                    </Button>

                  </label>
                </Box>
              </Box>

                <Box>
                    <JsonTable
                    sx={{ width: '70%' }}
                    jsonData={batches}
                    columnsToShow={["callers_list_id", "humanized_created_at", "status"]}
                    tooltipMap={{"humanized_created_at": "created_at"}}
                    actionsToShow={
                        {"Schedule": {"id": "callers_list_id", "scheduled_at": "scheduled_at"}}
                    }
                    accessToken={accessToken}
                    clickable={false}
                    headersDisplayedAs={["Batch Identifier", "Uploaded At", "Status"]}
                    agent={agentId}
                    />
                </Box>

              <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
                <DialogTitle>Upload CSV File</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Select a CSV file to upload.
                  </DialogContentText>
                  <input type="file" accept=".csv" onChange={handleFileChange} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseUploadDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} color="primary">
                    Upload
                  </Button>
                </DialogActions>
              </Dialog>

            </>
          )}
        </Box>
    );
}

export default BatchCall;
