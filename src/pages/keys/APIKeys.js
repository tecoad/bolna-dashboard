import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import JsonTable from '../../components/Table'; // Adjust the import path as necessary
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';
import createApiInstance from '../../utils/api';
import CustomTabs from '../../components/CustomTabs';


const APIKeys = ({ keys, handleOpenCreateKey, disabledText, handleCopyClick, handleCloseCreateKey, accessToken, openCreateKey, setToRefreshAfterDelete }) => {
  return (
    <>
      <Typography variant="body2" gutterBottom>
            These keys can be used to read and write data to Bolna. Please do not share these keys and make sure you store them somewhere secure.
      </Typography>

      <JsonTable
        sx={{ width: '70%' }}
        jsonData={keys}
        columnsToShow={["key_name", "humanized_accessed_at", "humanized_created_at"]}
        tooltipMap={{"humanized_accessed_at": "accessed_at", "humanized_created_at": "created_at"}}
        accessToken={accessToken}
        clickable={false}
        setToRefreshAfterDelete={setToRefreshAfterDelete}
        actionsToShow={{
            "Delete": {
              "id": "key_uuid",
              "url": "/keys",
            }
          }}
        headersDisplayedAs={["Key Identifier", "Last Accessed", "Created At"]}
      />

      {/* Dialog for API Keys */}
      <Dialog
        open={openCreateKey}
        onClose={handleCloseCreateKey}
        fullWidth
        maxWidth="md"
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
  );
};

export default APIKeys;