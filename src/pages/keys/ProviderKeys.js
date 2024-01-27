import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Grid } from '@mui/material';
import { Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import JsonTable from '../../components/Table';
import createApiInstance from '../../utils/api';

const ProviderKeys = ({ accessToken, openCreateProviderKey, setOpenCreateProviderKey }) => {
  const [providerKeys, setProviderKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProviderKeyName, setNewProviderKeyName] = useState('');
  const [newProviderKeyValue, setNewProviderKeyValue] = useState('');
  const [apiSuccess, setApiSuccess] = useState(false);
  const [toRefreshAfterDelete, setToRefreshAfterDelete] = useState(false);
  const api = createApiInstance(accessToken);


  const handleCloseCreateProviderKey = () => {
    setOpenCreateProviderKey(false);
    setNewProviderKeyName('');
    setNewProviderKeyValue('');
  };

  const handleCreateProviderKey = async () => {
    try {
      const body = {
        provider_name: newProviderKeyName,
        provider_value: newProviderKeyValue,
      };
      const response = await api.post('/providers', body);
      setApiSuccess(true);
      handleCloseCreateProviderKey();
    } catch (error) {
      console.error('Error adding Provider:', error);
    }
  };


  useEffect(() => {
    const fetchProviderKeys = async () => {
      try {
        const response = await api.get('/providers');
        setProviderKeys(response.data);
        setApiSuccess(false);
        setToRefreshAfterDelete(false);
        } catch (error) {
        console.error('Error fetching Providers:', error);
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched
      }
    };

    if (accessToken) {
      fetchProviderKeys();
    }
  }, [accessToken, apiSuccess, toRefreshAfterDelete]);

  return (
    <Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="body2" gutterBottom>
            These keys will be used to access your own Providers within Bolna.
          </Typography>

          <JsonTable
            sx={{ width: '70%' }}
            jsonData={providerKeys}
            accessToken={accessToken}
            columnsToShow={["provider_name", "provider_value", "humanized_created_at"]}
            clickable={false}
            tooltipMap={{"humanized_created_at": "created_at"}}
            actionsToShow={{
              "Delete": {
                "id": "provider_name",
                "url": "/providers",
                "resourceType": "Provider"
              }
            }}
            headersDisplayedAs={["Provider Name", "Provider Value", "Created At"]}
            setToRefreshAfterDelete={setToRefreshAfterDelete}

            // Customize other props as needed
          />
        </>
      )}

        {/* Dialog for adding Provider key */}
        <Dialog
          open={openCreateProviderKey}
          onClose={handleCloseCreateProviderKey}
          fullWidth
          maxWidth="sm"
          aria-labelledby="add-provider-dialog-title"
          slots={{
            backdrop: (props) => (
              <div
                {...props}
                style={{
                  backdropFilter: 'blur(2px)',
                  pointerEvents: 'none',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            ),
          }}
        >
          <DialogTitle id="add-provider-dialog-title">Add Provider</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your Provider key name and value:
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="newProviderKeyName"
                  label="Provider Key Name"
                  placeholder="OPENAI_API_KEY"
                  type="text"
                  fullWidth
                  value={newProviderKeyName}
                  onChange={(e) => setNewProviderKeyName(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="newProviderKeyValue"
                  label="Provider Key Value"
                  placeholder="sk-0123456789"
                  type="text"
                  fullWidth
                  value={newProviderKeyValue}
                  onChange={(e) => setNewProviderKeyValue(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateProviderKey} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleCreateProviderKey} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

    </Box>
  );
};

export default ProviderKeys;