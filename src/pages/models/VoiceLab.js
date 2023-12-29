import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Autocomplete, FormControl, CircularProgress } from '@mui/material';
import voices from '../../data/voices.json';
import axios from 'axios';

function VoiceLab({ userId }) {
    const [text, setText] = useState('');
    const [selectedVoice, setSelectedVoice] = useState({
        "name": "Kajal",
        "id": "Kajal",
        "languageCode": "en-IN",
        "model": "neural",
        "provider": "polly",
        "lowLatency": true,
        "accent": "Indian"
    });
    const [audioSrc, setAudioSrc] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true)
        try {
            let payload = {
                text: text,
                provider: selectedVoice.provider
            }
            console.log(`selectedVoice ${JSON.stringify(selectedVoice)}`)
            if (selectedVoice.provider == "polly") {
                payload.provider_config = {
                    language: selectedVoice.languageCode,
                    voice: selectedVoice.name,
                    engine: selectedVoice.model
                }
            }

            console.log(`payload ${JSON.stringify(payload)} engine ${payload.provider_config.engine}`)

            const response = await axios.post(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/tts`, payload);
            setLoading(false);
            console.log(`Got Base64 string ${response.data}`)
            const audioUrl = `data:audio/mp3;base64,${response.data.data}`;
            setAudioSrc(audioUrl);

        } catch (error) {
            console.error('Error fetching audio:', error);
            return '';
        }

    };

    const handleAddVoice = async () => {
        const userId = "e0bdd41c-17e1-4ae0-b7e6-f84f876ab41e";
        try {
            setLoading(true)
            const response = await axios.post(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/user/voice`, {
                user_id: userId,
                voice: selectedVoice
            });
            setLoading(false)
            console.log('Voice added:', response.data);
        } catch (error) {
            console.error('Error adding voice:', error);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant='h4' gutterBottom>
                        Voice Lab
                    </Typography>
                    <Autocomplete
                        options={voices}
                        defaultValue={selectedVoice}
                        getOptionLabel={(option) => option.name}
                        filterOptions={(options, { inputValue }) => {
                            return options.filter(option =>
                                option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                option.languageCode.toLowerCase().includes(inputValue.toLowerCase()) ||
                                option.model.toLowerCase().includes(inputValue.toLowerCase()) ||
                                option.provider.toLowerCase().includes(inputValue.toLowerCase()) ||
                                option.accent.toLowerCase().includes(inputValue.toLowerCase())
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label="Select Voice" />}
                        onChange={(event, newValue) => setSelectedVoice(newValue)}
                        fullWidth
                        margin="normal"
                    />


                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Enter Text"
                            multiline
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </FormControl>


                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Try Voice
                    </Button>

                    <Button variant="contained" color="secondary" onClick={handleAddVoice}>
                        Add Voice
                    </Button>

                </>
            )}

            {audioSrc && <audio controls src={audioSrc} />}

        </Box>
    );
}

export default VoiceLab;

