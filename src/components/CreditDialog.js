import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Popover, MenuItem, Stack, ListSubheader, ListItemButton } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';


function CreditDialog({ open, handleClose, userInfo }) {
      const [selectedCurrency, setSelectedCurrency] = useState(null);
      
      const handleCurrencySelection = (currency) => {
        setSelectedCurrency(currency);
        // Redirect user to payment link based on selected currency
        if (currency === 'IND') {
            window.open(`https://buy.stripe.com/bIY9E06dv28Z3oA002?client_reference_id=${userInfo.user_id}`);
        } else if (currency === 'USD') {
            window.open(`https://buy.stripe.com/dR64jG0Tb00R7EQ3cf?client_reference_id=${userInfo.user_id}`);
        }
      };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add More Credits</DialogTitle>

            <DialogContent dividers="true">
            <div>

            <Stack direction="row" spacing={2}>
                <Button variant="contained" endIcon={<CurrencyRupeeIcon />} onClick={() => handleCurrencySelection('IND')}>
                    For people residing in India
                </Button>

                <Button variant="contained" endIcon={<AttachMoneyIcon />} onClick={() => handleCurrencySelection('USD')}>
                    For people residing elsewhere
                </Button>
            </Stack>

            </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
            </DialogActions>
        </Dialog>

    );
}

export default CreditDialog;