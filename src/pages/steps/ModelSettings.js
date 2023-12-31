import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Grid, Box, Autocomplete, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import VoiceLab from '../models/VoiceLab';
import { getVoiceLabel } from '../../utils/utils';


function ModelSettings({ formData, onFormDataChange, llmModels, voices, setVoices, initiallySelectedVoice, initiallySelectedModel, userId }) {
    var val = null
    var key = null
    const [selectedVoice, setSelectedVoice] = useState(initiallySelectedVoice);
    const [selectedModel, setSelectedModel] = useState(initiallySelectedModel);
    const [availableLLMModels, setAvailableLLMModels] = useState(llmModels);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };


    useEffect(() => {
        if (formData.basicConfig.assistantType == "IVR") {
            let filteredLLMModels = llmModels.filter(model => model.json_mode == "Yes");
            console.log(`Filtered LLM Model = ${JSON.stringify(filteredLLMModels)}`)
            setAvailableLLMModels([...filteredLLMModels]);
        }
    }, [formData])

    const handleChange = (type, event) => {

        let toChangePair = {}
        let conf = type + "Config"

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
            console.log(`event.target.name = ${event.target.name}, val ${event.target.value} type ${type}`)
            val = event.target.value
            key = event.target.name
            toChangePair = { [key]: val }
        }

        console.log(`Name ${key} Value ${val}`)

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
                    <Typography variant="h6"> Basic Settings</Typography>
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
                            renderInput={(params) => <TextField {...params} label="Select Model" variant='standard' />}
                            onChange={(event, newValue) => handleChange("llm", newValue)}
                            fullWidth
                            margin="normal"
                        />
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '-1%' }}>
                        <Autocomplete
                            options={languages}
                            name="language"
                            getOptionLabel={(option) => option}
                            value={formData.modelsConfig.asrConfig.language}
                            renderInput={(params) => (
                                <TextField {...params} label="Language" margin="normal" variant='standard' />
                            )}
                            onChange={(event, newValue) => handleChange("asr", newValue)}
                        />

                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <FormControl sx={{ left: '20%', width: "50%" }}>

                            <Autocomplete
                                options={voices}
                                defaultValue={selectedVoice}
                                name="voice"
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
                                renderInput={(params) => <TextField {...params} label="Select Voice" variant='standard' />}
                                onChange={(event, newValue) => handleChange("tts", newValue)}
                                fullWidth
                                margin="normal"
                            />

                        </FormControl>
                        <Button size="small" variant="contained" sx={{ position: 'relative', marginLeft: "22%" }} onClick={handleDialogOpen}>Try Out</Button>
                    </Box>


                </Grid>

                {/* Advanced Settings */}
                <Grid item xs={12} alignContent={"left"}>
                    <Typography variant="h4">Advanced Settings </Typography>
                </Grid>

                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6">LLM Settings </Typography>
                </Grid>

                <Grid item xs={12} md={9}>
                    <FormControl sx={{ alignItems: "left", width: "60%" }} >
                        <TextField
                            label="Max Tokens"
                            type="number"
                            name="maxTokens"
                            value={formData.modelsConfig.llmConfig.maxTokens || ''}
                            onChange={e => handleChange("llm", e)}
                            fullWidth
                            margin="normal"
                            variant='standard'
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

                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6">ASR Settings </Typography>
                </Grid>

                <Grid item xs={12} md={9}>


                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px' }} gutterBottom>
                        <InputLabel>Model Name</InputLabel>
                        <Select
                            name="model"
                            value={formData.modelsConfig.asrConfig.model || ''}
                            onChange={e => handleChange("asr", e)}
                            variant='standard'
                        >
                            {asrModels.map((model, index) => (
                                <MenuItem key={index} value={model}>{model}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>




                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px' }} gutterBottom>
                        <InputLabel>Sampling Rate</InputLabel>
                        <Select
                            name="samplingRate"
                            value={formData.modelsConfig.asrConfig.samplingRate || ''}
                            onChange={e => handleChange("asr", e)}
                            variant='standard'
                        >
                            {samplingRates.map((rate, index) => (
                                <MenuItem key={index} value={rate}>{rate}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px' }}>
                        <InputLabel>Streaming</InputLabel>
                        <Select
                            name="streaming"
                            value={formData.modelsConfig.asrConfig.streaming}
                            onChange={e => handleChange("asr", e)}
                            variant='standard'
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                    </FormControl>

                    <br />


                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px' }} >
                        <Typography gutterBottom>Endpointing (Silence length in ms)</Typography>
                        <Slider
                            name="endpointing"
                            value={formData.modelsConfig.asrConfig.endpointing || 400}
                            onChange={e => handleChange("asr", e)}
                            step={100}
                            marks={marks}
                            min={100}
                            max={1500}
                        />
                    </FormControl>

                </Grid>

                {/* TTS Settings */}
                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6">TTS Settings</Typography>
                </Grid>
                <Grid item xs={12} md={9}>


                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: "-1%" }}>
                        <TextField
                            label="Buffer Size"
                            type="number"
                            name="bufferSize"
                            value={formData.modelsConfig.ttsConfig.bufferSize || ''}
                            onChange={e => handleChange("tts", e)}
                            fullWidth
                            margin="normal"
                            variant='standard'
                        />
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%" }}>
                        <InputLabel>Streaming</InputLabel>
                        <Select
                            name="streaming"
                            value={formData.modelsConfig.ttsConfig.streaming}
                            onChange={e => handleChange("tts", e)}
                            variant='standard'
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Dialog open={isDialogOpen} onClose={handleDialogClose} userId={userId} fullWidth maxWidth="md">
                    <VoiceLab setVoices={setVoices} voices={voices} userId={userId} />
                </Dialog>

            </Grid>
        </form>
    );
}

export default ModelSettings;
