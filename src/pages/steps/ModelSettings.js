import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Grid, Box, Autocomplete } from '@mui/material';


function ModelSettings({ formData, onFormDataChange, llmModels, voices, initiallySelectedVoice, initiallySelectedModel }) {
    var val = null
    var key = null
    const [selectedVoice, setSelectedVoice] = useState(initiallySelectedVoice);
    const [selectedModel, setSelectedModel] = useState(initiallySelectedModel);
    const [availableLLMModels, setAvailableLLMModels] = useState(llmModels);

    useEffect(() => {
        if (formData.basicConfig.assistantType == "IVR") {
            let filteredLLMModels = llmModels.filter(model => model.json_mode == "Yes");
            console.log(`Filtered LLM Model = ${JSON.stringify(filteredLLMModels)}`)
            setAvailableLLMModels([...filteredLLMModels]);
        }
    }, [formData])
    const handleChange = (type, event) => {
        let toChangePair = {}
        if (event?.target?.name == undefined || event?.target?.name == null) {
            if (type == "asr") {
                val = event
                key = "language"
                toChangePair = { [key]: val }
            } else if (type == "tts") {
                val = event.name
                key = "voice"
                setSelectedVoice(event)
                toChangePair = { [key]: val }
            } else {
                val = event.model
                key = "model"
                setSelectedModel(event)
                toChangePair = { [key]: val, family: event.family }
            }

        } else {
            val = event.target.value
            toChangePair = { [key]: val }
        }

        console.log(`Name ${key} Value ${val}`)

        let conf = type + "Config"
        onFormDataChange({
            ...formData,
            modelsConfig: {
                ...formData.modelsConfig,
                [conf]: {
                    ...formData.modelsConfig[conf],
                    ...toChangePair
                }
            }
        });
    };


    const marks = [
        { value: 0, label: 'Professional' },
        { value: 1, label: 'Highly Creative' },
    ];

    const languages = ['en', 'hi', 'es', 'fr', 'it'];
    const asrModels = ['AWS', 'Google', 'Nova-2', 'Whisper'];
    const samplingRates = [8000, 16000, 24000, 44100, 48000];
    const channels = ['1', '2'];


    return (
        <form>
            <Grid container spacing={2}>
                {/* LLM Settings */}
                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6">LLM Settings</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <FormControl sx={{ alignItems: "left", width: "60%" }} >
                        <Autocomplete
                            options={availableLLMModels}
                            defaultValue={selectedModel}
                            name="Model"
                            getOptionLabel={(option) => option.display_name}
                            filterOptions={(options, { inputValue }) => {
                                return options.filter(option =>
                                    option.display_name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                    option.family.toLowerCase().includes(inputValue.toLowerCase())
                                );
                            }}
                            renderInput={(params) => <TextField {...params} label="Select Model" />}
                            onChange={(event, newValue) => handleChange("llm", newValue)}
                            fullWidth
                            margin="normal"
                        />

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
                            value={formData.modelsConfig.llmConfig.temperature || 0.3}
                            onChange={e => handleChange("llm", e)}
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
                            name="language"
                            getOptionLabel={(option) => option}
                            value={formData.modelsConfig.asrConfig.language}
                            renderInput={(params) => (
                                <TextField {...params} label="Language" margin="normal" />
                            )}
                            onChange={(event, newValue) => handleChange("asr", newValue)}
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
                            value={formData.modelsConfig.asrConfig.streaming}
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

                        <Autocomplete
                            options={voices}
                            defaultValue={selectedVoice}
                            name="voice"
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
                            onChange={(event, newValue) => handleChange("tts", newValue)}
                            fullWidth
                            margin="normal"
                        />

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
                            value={formData.modelsConfig.ttsConfig.streaming}
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
