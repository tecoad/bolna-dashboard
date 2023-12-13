import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, TextField } from '@mui/material';

function EngagementConfiguration({ formData, onFormDataChange }) {
    const [channel, setChannel] = useState(formData.engagementConfig.channel || '');
    const handleChange = (event) => {
        if (event.target.name == "channel") {
            setChannel(event.target.value);
        }

        if (event.target.value == 'Telephone') {
            onFormDataChange({
                ...formData, engagementConfig: { format: "PCM", [event.target.name]: event.target.value }

            });

        } else {

            onFormDataChange({
                ...formData, engagementConfig: { ...formData.engagementConfig, [event.target.name]: event.target.value }

            });
        }

    };

    useEffect(() => {
        if (channel === 'Telephone') {
            onFormDataChange({ ...formData, format: 'PCM' });
        }
    }, [channel, formData, onFormDataChange]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ alignItems: "left" }}>
                <FormControl sx={{ alignItems: "left", width: "50%" }} margin="normal">
                    <InputLabel id="channel-label">Channel</InputLabel>
                    <Select
                        labelId="channel-label"
                        id="channel-select"
                        name="channel"
                        value={channel}
                        label="Channel"
                        onChange={handleChange}
                    >
                        <MenuItem value="Telephone">Telephone</MenuItem>
                        <MenuItem value="Websocket">Websocket</MenuItem>
                        <MenuItem value="Zoom">Zoom</MenuItem>
                        <MenuItem value="SDK">SDK</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ alignItems: "left" }}>
                <FormControl sx={{ alignItems: "left", width: "50%" }} margin="normal">
                    {channel === 'Telephone' ? (
                        <TextField
                            label="Format"
                            variant="outlined"
                            name="format"
                            value="PCM"
                            disabled
                        />
                    ) : (
                        <>
                            <InputLabel id="format-label">Format</InputLabel>
                            <Select
                                labelId="format-label"
                                id="format-select"
                                name="format"
                                value={formData.engagementConfig.format || ''}
                                label="Format"
                                onChange={handleChange}
                            >
                                <MenuItem value="mp3">MP3</MenuItem>
                                <MenuItem value="pcm">PCM</MenuItem>
                                {/* Add other formats as needed */}
                            </Select>
                        </>
                    )}
                </FormControl>
            </Box>
        </Box>
    );
}

export default EngagementConfiguration;
