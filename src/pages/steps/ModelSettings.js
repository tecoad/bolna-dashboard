import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Grid, Box, Autocomplete, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import VoiceLab from '../models/VoiceLab';
import { getVoiceLabel } from '../../utils/utils';
import { renderTooltip } from '../../components/CustomTooltip';
import { Mixpanel } from '../../utils/mixpanel';



function ModelSettings({ formData, onFormDataChange, llmModels, voices, setVoices, initiallySelectedVoice, initiallySelectedModel, accessToken }) {
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
            //console.log(`event.target.name = ${event.target.name}, val ${event.target.value} type ${type}`)
            val = event.target.value
            key = event.target.name
            toChangePair = { [key]: val }
        }

        Mixpanel.track('advance_setting', {
            name: key,
            val: val
        });

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

    const languages = ['en', 'hi', 'es', 'fr', 'it', "pt-BR"];
    const asrModels = ['whisper', 'deepgram'];

    return (
        <form>
            <Grid container spacing={2}>
                {/* LLM Settings */}
                <Grid item xs={2} alignContent={"left"}>
                    <Typography variant="h6"> Basic Settings</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <FormControl sx={{ alignItems: "left", flexDirection: 'row', width: "60%" }}>
                        <Autocomplete options={availableLLMModels} defaultValue={selectedModel} name="Model" getOptionLabel={(option) =>
                            option.display_name}
                            filterOptions={(options, { inputValue }) => {
                                return options.filter(option =>
                                    option.display_name.toLowerCase().includes(inputValue.toLowerCase()) ||
                                    option.family.toLowerCase().includes(inputValue.toLowerCase())
                                );
                            }}
                            renderInput={(params) =>
                                <TextField {...params} label="Select Model" variant='standard' />}
                            onChange={(event, newValue) => handleChange("llm", newValue)}
                            fullWidth
                            margin="normal"
                        />

                        {renderTooltip("This is the LLM Model your user will chat with. gpt models are by OpenAI other are open source. GPT models are more expensive.")}

                    </FormControl>

                    <FormControl sx={{ alignItems: "left", flexDirection: 'row', width: "60%" }}>
                        <Autocomplete
                            options={languages}
                            name="language"
                            getOptionLabel={(option) => option}
                            value={formData.modelsConfig.asrConfig.language}
                            renderInput={(params) => (
                                <TextField {...params} label="Language" margin="normal" variant='standard' />
                            )}
                            onChange={(event, newValue) => handleChange("asr", newValue)}
                            fullWidth
                        />


                        {renderTooltip("This is the primary language of your agent. Only GPT models have Multilingual capabilities.")}

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
                    <FormControl sx={{ alignItems: "left", width: "60%", flexDirection: 'row' }} >
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
                        {renderTooltip("Max tokens to consider for ouput. More tokens would mean answer will be 1. Verbose and 2. Expensive ")}
                    </FormControl>
                    <FormControl sx={{ alignItems: "left", width: "60%" }} >
                        <Typography gutterBottom>Temperature {renderTooltip("Temperature allows you to experiment with creative liberties ")}</Typography>
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


                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px', flexDirection: 'row' }} gutterBottom>
                        <InputLabel>Model Name </InputLabel>
                        <Select
                            name="model"
                            value={formData.modelsConfig.asrConfig.model}
                            onChange={e => handleChange("asr", e)}
                            variant='standard'
                            fullWidth
                        >
                            {asrModels.map((model, index) => (
                                <MenuItem key={index} value={model}>{model}</MenuItem>
                            ))}
                        </Select>
                        {renderTooltip("These models will convert speech to text. Whisper is an open source model and hence cheapest but others might be better for your usecase.")}
                    </FormControl>

                    <FormControl sx={{ alignItems: "left", width: "60%", flexDirection: 'row' }} >
                        <TextField
                            label="Keywords (Comma seperated)"
                            type="text"
                            name="keywords"
                            value={formData.modelsConfig.asrConfig.keywords || ''}
                            onChange={e => handleChange("asr", e)}
                            fullWidth
                            margin="normal"
                            variant='standard'
                        />
                        {renderTooltip("Enter certain keywords/proper nouns you'd want to boost while understanding speech. You can also add a boosting factor between 0-10 ex: marmik:5")}
                    </FormControl>


                    {/* <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px', flexDirection: 'row' }} gutterBottom>
                        <InputLabel>Sampling Rate</InputLabel>
                        <Select
                            disabled={formData.engagementConfig.channel == "Telephone"}
                            name="samplingRate"
                            value={formData.modelsConfig.asrConfig.samplingRate || ''}
                            onChange={e => handleChange("asr", e)}
                            variant='standard'
                            fullWidth
                        >
                            {samplingRates.map((rate, index) => (
                                <MenuItem key={index} value={rate}>{rate}</MenuItem>
                            ))}
                        </Select>
                        {renderTooltip("If your chosen engagement setting is websocket, kindly let us know the sample rate at which we will receive the audio")}
                    </FormControl> */}

                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px', flexDirection: 'row' }}>
                        <InputLabel>Streaming</InputLabel>
                        <Select
                            name="streaming"
                            value={formData.modelsConfig.asrConfig.streaming}
                            onChange={e => handleChange("asr", e)}
                            variant='standard'
                            fullWidth
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </Select>
                        {renderTooltip("This will enable truly human like conversation")}
                    </FormControl>

                    <br />


                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: '10px' }} >
                        <Typography gutterBottom>Endpointing (Silence length in ms) {renderTooltip("This setting allows agent to understand if the human has stopped speaking. For example with 400ms agent will start speaking only after there's a silence of 400ms from human's end. ")} </Typography>
                        <Slider
                            name="endpointing"
                            value={formData.modelsConfig.asrConfig.endpointing || 400}
                            onChange={e => handleChange("asr", e)}
                            step={50}
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


                    <FormControl sx={{ alignItems: "left", width: "60%", marginTop: "-1%", flexDirection: 'row' }}>
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
                        {renderTooltip("LLM will generally output token and we will buffer those tokens before generating audio. Play with these settings to bring the best human like qualities for your assistant.")}
                    </FormControl>
                </Grid>

                <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
                    <VoiceLab setVoices={setVoices} accessToken={accessToken} voices={voices} defaultValue={selectedVoice} />
                </Dialog>

            </Grid>
        </form>
    );
}

export default ModelSettings;
