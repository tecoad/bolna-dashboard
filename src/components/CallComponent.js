import React, { useState, useEffect } from 'react';
import { DialogContentText, Typography, Button, Dialog, CircularProgress, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import createApiInstance from '../utils/api';


const CallComponent = ({ agentId, accessToken }) => {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const api = createApiInstance(accessToken);

  const handleClick = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (phoneNumber !== '') {
      try {
        const response = await api.post('/make_call', {
          agent_id: agentId,
          recipient_phone_number: phoneNumber
        });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        // Handle the successful response here
        console.log('API call successful');
        setOpen(false); // Close the dialog after successful API call
      } catch (error) {
        // Handle errors here
        console.error('There was an error making the API call');
        setErrorMessage(error?.response?.data?.message); 
      }
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{ marginRight: 2, backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
      >
        Call me
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter your phone number</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your phone number with the country code.
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="phone-number"
            label="Phone Number"
            type="text"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          {errorMessage && (
            <DialogContentText style={{ color: 'red' }}>
              {errorMessage}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallComponent;
