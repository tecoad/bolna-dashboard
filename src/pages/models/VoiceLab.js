import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Autocomplete, FormControl, CircularProgress } from '@mui/material';
import defaultVoices from '../../data/voices.json';
import axios from 'axios';
import { getVoiceLabel } from '../../utils/utils';
import createApiInstance from '../../utils/api';

function VoiceLab({ setVoices, voices, defaultValue, accessToken }) {
    const [text, setText] = useState('');
    const [selectedVoice, setSelectedVoice] = useState({ ...defaultValue });
    const [audioSrc, setAudioSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const maxChars = 50;
    const api = createApiInstance(accessToken);

    const handleTextChange = (e) => {
        const newText = e.target.value.slice(0, maxChars);
        setText(newText);
    };

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
            } else if (selectedVoice.provider == "elevenlabs") {
                payload.provider_config = {
                    model: selectedVoice.model,
                    voice: selectedVoice.name,
                    voice_id: selectedVoice.id
                }
            } else if (selectedVoice.provider == "xtts") {
                payload.provider_config = {
                    language: selectedVoice.languageCode,
                    voice: selectedVoice.name,
                }
            } else if (selectedVoice.provider == "openai") {
                payload.provider_config = {
                    model: selectedVoice.model,
                    voice: selectedVoice.name,
                }
            }

            console.log(`payload ${JSON.stringify(payload)} engine ${payload.provider_config.engine}`)

            const response = await axios.post(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/tts`, payload);
            setLoading(false);
            console.log(`Got Base64 string ${JSON.stringify(response.data)}`)
            const audioUrl = `data:audio/mp3;base64,${response.data.data}`;
            setAudioSrc(audioUrl);

        } catch (error) {
            console.error('Error fetching audio:', error);
            return '';
        }

    };

    const handleAddVoice = async () => {
        try {
            let addedMyVoice = voices.some(voice => voice.id === selectedVoice.id)
            if (addedMyVoice) {
                alert("You already have this voice")
                return;
            }
            setLoading(true)
            const response = await api.post(`/add_voice`, {
                voice: selectedVoice
            });
            setVoices([...voices, selectedVoice])
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
                        options={defaultVoices}
                        defaultValue={selectedVoice}
                        getOptionLabel={getVoiceLabel}
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
                            onChange={handleTextChange}
                            inputProps={{ maxLength: maxChars }}
                            helperText={`${text.length}/${maxChars}`}
                            FormHelperTextProps={{ sx: { textAlign: 'right' } }}

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

