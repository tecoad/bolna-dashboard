import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Grid, Box, Autocomplete } from '@mui/material';

const models = ['GPT-3.5', 'GPT-4', 'Mixtral', 'Mistral-7B', 'Llama2-7B', 'Llama2-13B', 'Llama2-70B']; // Array of models

function ModelSettings({ formData, onFormDataChange }) {

    const handleChange = (type, event) => {
        let conf = type + "Config"
        onFormDataChange({
            ...formData,
            modelsConfig: {
                ...formData.modelsConfig,
                [conf]: {
                    ...formData.modelsConfig[conf],
                    [event.target.name]: event.target.value
                }
            }
        });
    };


    const handleSliderChange = (event, newValue) => {
        onFormDataChange({ temperature: newValue });
    };

    const marks = [
        { value: 0, label: 'Professional' },
        { value: 1, label: 'Highly Creative' },
    ];

    const languages = ['En', 'Hi', 'Es', 'Fr'];
    const asrModels = ['AWS', 'Google', 'Nova-2', 'Whisper'];
    const samplingRates = [8000, 16000, 24000, 44100];
    const channels = ['1', '2'];
    const ttsVoices = ['Mark', 'Jessica', 'Kamlesh', 'Rekha', 'Priya', 'Suresh'];


    return (
        <form>
            <Grid container spacing={2}>
                {/* LLM Settings */}
                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6">LLM Settings</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <FormControl sx={{ alignItems: "left", width: "60%" }} >
                        <InputLabel>Model</InputLabel>
                        <Select
                            name="model"
                            value={formData.modelsConfig.llmConfig.model || ''}
                            onChange={(e, val) => handleChange("llm", e)}
                        >
                            {models.map((model, index) => (
                                <MenuItem key={index} value={model}>{model}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ alignItems: "left", width: "60%" }} >
                        <TextField
                            label="Max Tokens"
                            type="number"
                            name="maxTokens"
                            value={formData.modelsConfig.llmConfig.maxTokens || ''}
                            onChange={e => handleChange("llm", e)}
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>
                    <FormControl sx={{ alignItems: "left", width: "60%" }} >
                        <Typography gutterBottom>Temperature</Typography>
                        <Slider
                            name="temperature"
                            value={formData.modelsConfig.llmConfig.temperature || 0.5}
                            onChange={handleSliderChange}
                            step={0.01}
                            marks={marks}
                            min={0}
                            max={1}
                        />
                    </FormControl>

                </Grid>

                {/* ASR Settings */}
                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6">ASR Settings</Typography>
                </Grid>

                <Grid item xs={12} md={9}>


                    <FormControl sx={{ alignItems: "left", width: "60%" }}>
                        <InputLabel>Model Name</InputLabel>
                        <Select
                            name="model"
                            value={formData.modelsConfig.asrConfig.model || ''}
                            onChange={e => handleChange("asr", e)}
                        >
                            {asrModels.map((model, index) => (
                                <MenuItem key={index} value={model}>{model}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '-1%' }}>
                        <Autocomplete
                            options={languages}
                            getOptionLabel={(option) => option}
                            value={formData.modelsConfig.asrConfig.language}
                            renderInput={(params) => (
                                <TextField {...params} label="Language" margin="normal" />
                            )}
                            onChange={e => handleChange("asr", e)}
                        />

                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%" }}>
                        <InputLabel>Sampling Rate</InputLabel>
                        <Select
                            name="samplingRate"
                            value={formData.modelsConfig.asrConfig.samplingRate || ''}
                            onChange={e => handleChange("asr", e)}
                        >
                            {samplingRates.map((rate, index) => (
                                <MenuItem key={index} value={rate}>{rate}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '1%' }}>
                        <InputLabel>Streaming</InputLabel>
                        <Select
                            name="streaming"
                            value={formData.modelsConfig.asrConfig.streaming || ''}
                            onChange={e => handleChange("asr", e)}
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                    </FormControl>

                    <br />
                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '1%' }}>
                        <InputLabel>Channels</InputLabel>
                        <Select
                            name="channels"
                            value={formData.modelsConfig.asrConfig.channels || ''}
                            onChange={e => handleChange("asr", e)}
                        >
                            {channels.map((channel, index) => (
                                <MenuItem key={index} value={channel}>{channel}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* TTS Settings */}
                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6">TTS Settings</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <FormControl sx={{ alignItems: "left", width: "60%" }}>
                        <InputLabel>Voice</InputLabel>
                        <Select
                            name="voice"
                            value={formData.modelsConfig.ttsConfig.voice || ''}
                            onChange={e => handleChange("tts", e)}
                        >
                            {ttsVoices.map((voice, index) => (
                                <MenuItem key={index} value={voice}>{voice}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: "-1%" }}>
                        <TextField
                            label="Buffer Size"
                            type="number"
                            name="bufferSize"
                            value={formData.modelsConfig.ttsConfig.bufferSize || ''}
                            onChange={e => handleChange("tts", e)}
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%" }}>
                        <InputLabel>Streaming</InputLabel>
                        <Select
                            name="streaming"
                            value={formData.modelsConfig.ttsConfig.streaming || ''}
                            onChange={e => handleChange("tts", e)}
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </form>
    );
}

export default ModelSettings;
