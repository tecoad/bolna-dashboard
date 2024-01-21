import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Divider, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import JsonTable from '../components/Table';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';
import createApiInstance from '../utils/api';
import CustomTabs from '../components/CustomTabs';
import APIKeys from './keys/APIKeys';
import ProviderKeys from './keys/ProviderKeys';


function Keys({ accessToken }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openCreateKey, setOpenCreateKey] = useState(false);
  const [disabledText, setDisabledText] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [openCreateProviderKey, setOpenCreateProviderKey] = useState(false);
  const api = createApiInstance(accessToken);

  const handleOpenCreateKey = async () => {
    try {
      const response = await api.post('/keys');
      setDisabledText(response.data.api_key);
      setOpenCreateKey(true);
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  };

  const handleOpenCreateProviderKey = () => {
    setOpenCreateProviderKey(true);
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
    const fetchApiKeys = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/keys');
        setApiKeys(response.data);
      } catch (error) {
        console.error('Error fetching agents: Making loading false', error);
        setIsLoading(false)
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchApiKeys();
    }
  }, [accessToken]);


  if (error) {
    return <Typography>Error loading API keys.</Typography>;
  }

  const tabsData = [
    { name: 'API Keys', component: <APIKeys openCreateKey={openCreateKey} accessToken={accessToken} keys={apiKeys} handleOpenCreateKey={handleOpenCreateKey} disabledText={disabledText} handleCopyClick={handleCopyClick} handleCloseCreateKey={handleCloseCreateKey} /> },
    { name: 'Provider Keys', component: <ProviderKeys accessToken={accessToken} setOpenCreateProviderKey={setOpenCreateProviderKey} openCreateProviderKey={openCreateProviderKey} /> },
  ];

  return (
    <Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Developer</Typography>
            {
              activeTab == 0 ? (
                <Box>
                  <Button
                    onClick={handleOpenCreateKey}
                    sx={{ backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                  >
                    Generate new key
                  </Button>
                </Box>
              ) : 
                <Box>
                    <Button
                    onClick={handleOpenCreateProviderKey}
                    sx={{ backgroundColor: '#50C878', color: 'white', '&:hover': { backgroundColor: '#369456' } }}
                    >
                    Add Provider Key
                    </Button>
                </Box>
            }

          </Box>

          <CustomTabs tabsData={tabsData} orientation={"horizontal"} setActiveTabInParent={setActiveTab} />
        </>
      )}
    </Box>
  );
}

export default Keys;