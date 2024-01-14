import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import JsonTable from '../components/Table'; // Adjust the import path as necessary
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';
import createApiInstance from '../utils/api';



function APIKeys({ accessToken }) {
    const [keys, setKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openCreateKey, setOpenCreateKey] = useState(false);
    const [disabledText, setDisabledText] = useState('');
    const api = createApiInstance(accessToken);

    const handleOpenCreateKey = async () => {
        try {
            const response = await api.post('/create_api_key');
          
          setDisabledText(response.data.api_key);

          setOpenCreateKey(true);
        } catch (error) {
          console.error('Error fetching API:', error);
        }

    };

    const handleCloseCreateKey = () => {
        setOpenCreateKey(false);
        window.location.reload();
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(disabledText).then(() => {
            console.log('Text copied to clipboard');
        }).catch((err) => {
            console.error('Unable to copy text to clipboard', err);
        });
    };

    useEffect(() => {
        const fetchKeys = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api_keys');
                setKeys(response.data);
            } catch (error) {
                console.error('Error fetching agents: Making loading false', error);
                setIsLoading(false)
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (accessToken) {
            fetchKeys();
        }
    }, [accessToken]);


    if (error) {
        return <Typography>Error loading keys.</Typography>;
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
                        <Typography variant="h4">My API Keys</Typography>
                        {
                            (
                                <Box>
                                    <Button
                                        onClick={handleOpenCreateKey}
                                        sx={{ backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                                    >
                                        Create new
                                    </Button>
                                </Box>
                            )
                        }

                    </Box>
                    <Box>
                        <JsonTable
                        sx={{ width: '70%' }}
                        jsonData={keys}
                        columnsToShow={["key_name", "humanized_accessed_at", "humanized_created_at"]}
                        tooltipMap={{"humanized_accessed_at": "accessed_at", "humanized_created_at": "created_at"}}
                        accessToken={accessToken}
                        clickable={false}
                        actionsToShow={{"Delete": "key_uuid"}}
                        headersDisplayedAs={["Key Identifier", "Last Accessed", "Created At"]}
                        />
                    </Box>


                    {/* Dialog for API Keys */}
                      <Dialog
                        open={openCreateKey} onClose={handleCloseCreateKey} fullWidth maxWidth="md"
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Your API Key"}
                          <Divider />
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            This will be the only time you can see your API key.<br/>


                            <form>
                              <TextField
                                variant="outlined"
                                fullWidth
                                disabled
                                value={disabledText}
                                // You can add more props as needed
                              />
                              <IconButton onClick={handleCopyClick} type="button" aria-label="copy">
                                <FileCopyIcon />
                              </IconButton>
                            </form>
                            Please save it somewhere safe and accessible. If you lose your API key, you will need to generate a new one.


                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseCreateKey} autoFocus>Close</Button>
                        </DialogActions>
                      </Dialog>

                </>
            )}

        </Box>
    );
}

export default APIKeys;
