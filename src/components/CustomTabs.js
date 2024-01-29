import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Badge } from '@mui/material';

function CustomTabs({ tabsData, orientation, setActiveTabInParent, setOpenAnalyticsDialog=null }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        const tabName = tabsData[newValue].name;
        setActiveTab(newValue);
        if (setActiveTabInParent != null && setActiveTabInParent != undefined) {
            setActiveTabInParent(newValue)
        }

        if (setOpenAnalyticsDialog) {
            if (tabName === 'Analytics') {
                setOpenAnalyticsDialog(true); // Open the Analytics dialog
            } else {
                setOpenAnalyticsDialog(false);
            }
        }
    };

    const activeTabStyle = {
        color: 'primary.main',
        borderBottom: orientation === 'horizontal' ? '2px solid' : 'none',
        borderRight: orientation === 'vertical' ? '2px solid' : 'none',
        borderColor: 'primary.main',
        textAlign: 'left', // Align text to the left
    };

    const tabsContainerStyle = {
        borderRight: orientation === 'vertical' ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
        borderBottom: orientation === 'horizontal' ? '1px solid rgba(0, 0, 0, 0.12)' : 'none'
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: orientation === 'vertical' ? 'row' : 'column', width: '100%' }}>
            <Box sx={tabsContainerStyle}>
                <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    orientation={orientation}
                    aria-label="custom tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabsData.map((tab, index) => (
                        <Tab
                            sx={activeTab === index ? activeTabStyle : {}}
                            label={
                                tab.badgeContent ? (
                                    <Badge
                                        badgeContent={tab.badgeContent}
                                        color="secondary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                backgroundColor: 'red',
                                                fontFamily: 'Arial',
                                                right: '10px'
                                            } 
                                        }}
                                    >
                                    {tab.name}
                                  </Badge>
                                ) : (
                                  tab.name
                                )
                            }

                            key={index}
                        />
                    ))}
                </Tabs>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {tabsData.map((tab, index) => (
                    <TabPanel value={activeTab} index={index} key={index}>
                        {tab.component}
                    </TabPanel>
                ))}
            </Box>
        </Box>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`custom-tabpanel-${index}`}
            aria-labelledby={`custom-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, textAlign: 'left' }}> {/* Align text to the left */}
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default CustomTabs;
