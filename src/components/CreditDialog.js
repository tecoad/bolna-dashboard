import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Popover, MenuItem, Stack, ListSubheader, ListItemButton, DialogContentText } from '@mui/material';
import { Divider, TextField, Grid } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Mixpanel } from '../utils/mixpanel';
import createApiInstance from '../utils/api';
import { redirectToCheckout } from '../utils/payment';

function CreditDialog({ open, handleClose, userInfo, source, accessToken }) {
      //console.log("accessToken: ", accessToken);
      const [selectedCurrency, setSelectedCurrency] = useState(null);
      const [totalCredits, setTotalCredits] = useState('6');
      const [value, setValue] = useState('100');
      const [helperText, setHelperText] = useState(`You will pay total $6 for 100 credits. (6 USD per 100 credits)`);
      const [payButtonText, setPayButtonText] = useState(`Add 100 credits for $6`);
      const api = createApiInstance(accessToken);

      const handlePayment = async (totalCredits) => {
        try {
          const response = await api.post('/create_payment', {
              amount: totalCredits
            });

          if (response.status === 200) {
            const pay_id = response.data.message;
            redirectToCheckout(pay_id);
          }
        } catch (error) {
          console.error('Error fetching API:', error);
        }
      };

      const handleChange = (event) => {
        const inputValue = event.target.value;

        // Allow only numbers from 1 to 10
        if (inputValue === '' || (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 100 && parseInt(inputValue) <= 1000 && parseInt(inputValue) % 100 === 0)) {
          setValue(inputValue);
          setTotalCredits(6 * (inputValue/100));
          setHelperText(`You will pay total $${6 * (inputValue/100)} for ${inputValue} credits. (6 USD per 100 credits)`)
          setPayButtonText(`Add ${inputValue} credits for $${6 * (inputValue/100)}`)
        }
      };

      const handleBlur = () => {
        // If the input is empty, set it to 100
        if (value === '') {
          setValue('100');
        }
      };

      const handleCurrencySelection = (currency) => {
        Mixpanel.identify(userInfo.user_id);
        Mixpanel.track(`click_${currency}`, {
          source: source
        });

        // Redirect user to payment link based on selected currency
        if (currency === 'IND') {
            window.open(`https://buy.stripe.com/bIY9E06dv28Z3oA002?client_reference_id=${userInfo.user_id}`);
        } else if (currency === 'USD') {

            handlePayment();

        }
      };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} sx={{ p: 15 }}>
            <DialogTitle>Add More Credits</DialogTitle>
            <Divider />

            <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label="Enter number of credits (in multiples of 100)"
                        helperText={helperText}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        variant="outlined"
                        type="number"
                        inputProps={{
                          min: 100,
                          max: 1000,
                          step: 100,
                        }}
                      />
                  </Grid>
                  <Grid item xs={6}>
                  </Grid>
            </Grid>
            </DialogContent>


            <DialogActions>
            <Button onClick={() => handlePayment(totalCredits)} color="primary" variant="contained">
                {payButtonText}
            </Button>
            </DialogActions>
        </Dialog>

    );
}

export default CreditDialog;