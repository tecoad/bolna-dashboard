import React, { useEffect, useState } from 'react';
import { DialogContentText, DialogContent, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import createApiInstance from './api';

const XPAY_CHECKOUT_URL = 'https://pay.xpaycheckout.com';

const redirectToCheckout = (xIntentId, type = 'one-time') => {
    const url = new URL(XPAY_CHECKOUT_URL);
    url.searchParams.append('xpay_intent_id', xIntentId);
    url.searchParams.append('xpay_payment_type', type); 
    window.open(url.href).focus();
};

const getIntentFromXPay = async (intentId, type) => {
    let pg_status = 'FAILURE';
    const api = createApiInstance();
        try {
          const response = await api.get(`/verify_payment?intent_id=${intentId}&intent_type=${type}`);
          if (response.status === 200 && response.data.status === "success") {
            pg_status = 'SUCCESS';
          }
        } catch (error) {
          console.error('Error fetching API:', error);
        }

    return pg_status;
};

const PaymentStatusPage = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPgStatusCalled, PgStatusCalled] = useState(false);
  let isSentPgStatusRequest = false;

  useEffect(() => {
    if (isSentPgStatusRequest == true) {
      return;
    }
    isSentPgStatusRequest = true;

      const onPageLoad = async () => {
          PgStatusCalled(true);
          const url = new URL(window.location.href);
          const intentId = url.searchParams.get('xpay_intent_id');
          const type = url.searchParams.get('xpay_payment_type');

          if (!isPgStatusCalled) {
            const isSuccess = await getIntentFromXPay(intentId, type);
            setPaymentStatus(isSuccess);
          }
      };

      onPageLoad();
  }, []);

  const handleCloseDialog = () => {
    setPaymentStatus(null);
    // Redirect to another link upon closing the dialog
    window.location.href = '/dashboard/my-agents';
  };

  return (
      <div>
          {/* UI to display payment status */}
          <h1>Payment Status</h1>

          <Dialog open={paymentStatus === 'SUCCESS' || paymentStatus === 'FAILURE'} onClose={handleCloseDialog}>
            <DialogTitle>{paymentStatus === 'SUCCESS' ? 'Payment Successful!' : 'Payment Failed'}</DialogTitle>
            <DialogContent>
              <p>{paymentStatus === 'SUCCESS' ? 'Your payment was successful.' : 'Sorry, your payment failed.'}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>

      </div>
  );
};

export { redirectToCheckout, PaymentStatusPage };