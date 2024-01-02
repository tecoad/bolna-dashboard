import voices from '../data/voices.json'
export const CREATE_AGENT_FORM = {
    basicConfig: {
        assistantType: "FreeFlowing",
        assistantName: null,
        assistantTask: null
    },
    modelsConfig: {
        llmConfig: {
            model: '',
            maxTokens: 100,
            temperature: 0.2,
            family: ''
        },
        asrConfig: {
            model: 'Nova-2',
            language: 'en',
            samplingRate: 8000,
            streaming: true,
            channels: 1,
            endpointing: 400
        },
        ttsConfig: {
            voice: '',
            bufferSize: '40',
            streaming: true
        }
    },
    engagementConfig: {
        channel: 'Websocket',
        format: 'pcm'
    },
    rulesConfig: {
        prompts: {
            assistantDescription: null,
            rules: null,
            exampleConversation: null,
            objections: null,
            faqs: null
        },
        graph: null
    },
    followUpTaskConfig: {
        tasks: [],
        notificationDetails: {
            notificationMethods: [],
            emailTemplate: null,
            whatsappTemplate: null,
            smsTemeplate: null,
        },
        extractionDetails: null
    }
}

function getVoiceDetails(voice) {
    let selectedVoice = voices.filter(v => v.name == voice)[0]
    console.log(`voices ${JSON.stringify(voices)}, voice = ${JSON.stringify(voice)}`)
    return selectedVoice
}
function getModel(model, modelType, assistantType) {
    if (modelType === "llm") {
        if (assistantType == "IVR") {
            model = model.toLowerCase() == "gpt-3.5" ? "gpt-3.5-turbo-1106" : "gpt-4-1106-preview"
        } else {
            model = model.toLowerCase() == "gpt-3.5" ? "gpt-3.5-turbo-16k" : model.toLowerCase()
        }
        console.log(`Model ${model}`)
        return model
    } else {
        model = model == "Nova-2" ? "deepgram" : model;
        return model
    }
}

const getToolsConfig = (taskType, extraConfig) => {
    console.log(`task type = ${taskType} extra config ${JSON.stringify(extraConfig)}`)
    var llmTaskConfig = {
        "llm_agent": {
            "max_tokens": 100,
            "family": "openai",
            "request_json": true
        }
    }

    if (taskType === "notification") {
        console.log(`Setting notification follow-up task`)
        var apiTools = {}
        extraConfig.notificationMethods.forEach(mech => {
            if (mech === "email") {
                apiTools["email"] = {
                    "provider": "sendgrid",
                    "template": "EMAIL_TEMPLATE"
                }
            } else if (mech === "sms") {
                apiTools["sms"] = {
                    "provider": "twilio",
                    "template": "SMS_TEMPLATE"
                }
            } else if (mech == "whatsapp") {
                apiTools["whatsapp"] = {
                    "provider": "twilio",
                    "template": "WHATSAPP_TEMPLATE"
                }
            } else if (mech === "calendar") {
                apiTools["calendar"] = {
                    "provider": "google_calendar",
                    "title": "",
                    "email": "",
                    "time": ""
                }
            }
        })
        return { api_tools: apiTools }
    } else if (taskType === "extraction") {
        llmTaskConfig.llm_agent.streaming_model = "gpt-4-1106-preview"
        llmTaskConfig.llm_agent.extraction_json = extraConfig
    } else {
        console.log("SUmmarization task")
        llmTaskConfig.llm_agent.streaming_model = "gpt-4-1106-preview"
    }

    return llmTaskConfig
}
const getJsonForTaskType = (taskType, extraConfig) => {
    var toolChainSequence = taskType == "notification" ? "api_tools" : "llm"
    let taskStructure = {
        "task_type": `${taskType}`,
        "tools_config": getToolsConfig(taskType, extraConfig),
        "toolchain": {
            "execution": "parallel",
            "pipelines": [
                [
                    `${toolChainSequence}`
                ]
            ]
        }
    }
    return taskStructure
}

const getPollyConfig = (voiceDetails, agentData) => {
    return {
        voice: voiceDetails.name,
        engine: voiceDetails.model,
        language: voiceDetails.languageCode, // Need to make it better by converting it to respective language code as per model
        sampling_rate: agentData.modelsConfig.asrConfig.samplingRate.toString()

    }
}

const getElevenLabsConfig = (voiceDetails, agentData) => {
    return {
        voice: voiceDetails.name,
        voice_id: voiceDetails.id,
        model: voiceDetails.model

    }
}


const getXTTSConfig = (voiceDetails, agentData) => {
    console.log(`VOICE ${JSON.stringify(voiceDetails)} Agent Details ${JSON.stringify(agentData)}`)
    return {
        voice: voiceDetails.name,
        language: agentData.modelsConfig.asrConfig.language
    }
}

const getProviderConfig = (provider, voiceDetails, agentData) => {
    switch (provider) {
        case "polly":
            return getPollyConfig(voiceDetails, agentData)
        case "tortoise":
            console.log("Tortoise not implemented yet")
        //return getTortoiseConfig(voiceDetails)
        case "matcha":
            console.log("matcha not implemented yet")
        //return getMatchaConfig(voiceDetails)
        case "xtts":
            return getXTTSConfig(voiceDetails, agentData)
        case "elevenlabs":
            return getElevenLabsConfig(voiceDetails, agentData)
        default:
            console.log("Invalid provider")
    }
}
const getSynthesizerConfig = (agentData) => {
    let voiceDetails = getVoiceDetails(agentData.modelsConfig.ttsConfig.voice)
    console.log(`Voide details ${JSON.stringify(voiceDetails)}`)
    let synthesizerConfig = {
        provider: voiceDetails.provider,
        provider_config: getProviderConfig(voiceDetails.provider, voiceDetails, agentData),
        buffer_size: parseInt(agentData.modelsConfig.ttsConfig.bufferSize),
        audio_format: agentData.engagementConfig.format,
        sampling_rate: agentData.modelsConfig.asrConfig.samplingRate,
        stream: agentData.modelsConfig.ttsConfig.streaming
    }
    return synthesizerConfig
}

export const convertToCreateAgentPayload = (agentData) => {
    let payload = {
        "assistant_name": agentData.basicConfig.assistantName,
        "assistant_type": agentData.basicConfig.assistantTask,
        "tasks": [
            {
                "task_type": "conversation",
                "tools_config": {
                    "llm_agent": {
                        "max_tokens": agentData.modelsConfig.llmConfig.maxTokens,
                        "family": agentData.modelsConfig.llmConfig.family,
                        "streaming_model": agentData.modelsConfig.llmConfig.model,
                        "agent_flow_type": agentData.basicConfig.assistantType === "IVR" ? "preprocessed" : "streaming",
                        "classification_model": agentData.modelsConfig.llmConfig.model,
                        "use_fallback": true,
                        "temperature": agentData.modelsConfig.llmConfig.temperature
                    },
                    "synthesizer": { ...getSynthesizerConfig(agentData) },
                    "transcriber": {
                        "model": getModel(agentData.modelsConfig.asrConfig.model, "asr"),
                        "stream": agentData.modelsConfig.asrConfig.streaming,
                        "language": agentData.modelsConfig.asrConfig.language,
                        "endpointing": agentData.modelsConfig.asrConfig.endpointing
                    },
                    "input": {
                        "provider": agentData.engagementConfig.channel == "Websocket" ? "default" : "twilio",
                        "format": agentData.engagementConfig.format.toLowerCase()
                    },
                    "output": {
                        "provider": agentData.engagementConfig.channel == "Websocket" ? "default" : "twilio",
                        "format": agentData.engagementConfig.format.toLowerCase()
                    }
                },
                "toolchain": {
                    "execution": "parallel",
                    "pipelines": [
                        ["transcriber", "llm", "synthesizer"]
                    ]
                }
            }
        ]
    };

    if (agentData.followUpTaskConfig?.selectedTasks?.length > 0) {
        agentData.followUpTaskConfig.selectedTasks.forEach(task => {
            let taskConf = task == "notification" ? agentData.followUpTaskConfig.notificationDetails : task == "extraction" ? agentData.followUpTaskConfig.extractionDetails : null
            var followUpTask = getJsonForTaskType(task, taskConf)
            payload.tasks.push(followUpTask)
        })
    }
    return payload
}


const serializeNode = (node) => {
    if (node.bold) {
        return `<strong>${node.text}</strong>`;
    } else if (node.italic) {
        return `<em>${node.text}</em>`;
    } else {
        return node.text;
    }
};

const serialize = (nodes) => {
    return nodes.map(n => {
        if (n.children) {
            return serialize(n.children);
        } else {
            return serializeNode(n);
        }
    }).join('\n');
};

export const convertToText = (editorValue) => {
    return serialize(editorValue);
};


function getVoiceFromModel(model) {
    // Reverse logic of getModelFromVoice
    // Implement your specific logic here
    return model;
}

function getOriginalModel(model, modelType, assistantType) {
    // Reverse logic of getModel
    if (modelType === "llm") {
        if (assistantType == "IVRAgent") {
            model = model.includes("gpt-3.5-turbo-1106") ? "GPT-3.5" : "GPT-4";
        } else {
            model = model.includes("gpt-3.5-turbo-16k") ? "GPT-3.5" : model;
        }
        return model;
    } else if (modelType === "tts") {
        return getVoiceFromModel(model);
    } else {
        model = model == "deepgram" ? "Nova-2" : model;
        return model;
    }
}

const getFollowupTasks = (followUpTasks) => {
    let followupTaskConfig = {
        tasks: [],
        extractionDetails: null,
        notificationDetails: {
            notificationMethods: []
        }
    }

    if (followUpTasks.length == 0) {
        return followupTaskConfig
    }

    followUpTasks.forEach(task => {
        if (task.task_type == "extraction") {
            followupTaskConfig.tasks.push("extraction")
            followupTaskConfig.extractionDetails = task.tools_config?.llm_agent?.extraction_json
        } else if (task.task_type == "summarization") {
            followupTaskConfig.tasks.push("summarization")
        } else {
            followupTaskConfig.tasks.push("notification")
            Object.keys(task.tools_config.api_tools).forEach(apiTool => {
                followupTaskConfig.notificationDetails.notificationMethods.push(apiTool)
            })
        }
    })
    return followupTaskConfig
}

export const convertToCreateAgentForm = (payload) => {
    console.log(`Agent payload ${JSON.stringify(payload)}`)
    let agentTasks = [...payload.tasks]
    console.log(`Agent tasks ${JSON.stringify(agentTasks)}`)
    const agentData = agentTasks.shift()
    const followupTasks = [...agentTasks]
    console.log(`Agent data ${JSON.stringify(agentData)} followpTasks ${JSON.stringify(followupTasks)} payload ${JSON.stringify(payload)}`)
    const llmAgent = agentData.tools_config?.llm_agent;
    const synthesizer = agentData.tools_config?.synthesizer;
    const transcriber = agentData.tools_config?.transcriber;
    const input = agentData.tools_config?.input;
    let followupTaskConfig = getFollowupTasks(followupTasks)
    console.log(`followupTaskConfig ${JSON.stringify(followupTaskConfig)}`)
    console.log(`Synthesizer provider config ${JSON.stringify(synthesizer.provider_config)}`)
    var formData = {
        basicConfig: {
            assistantType: llmAgent.agent_flow_type === "preprocessed" ? "IVR" : "FreeFlowing",
            assistantName: payload.assistant_name,
            assistantTask: payload.assistant_type
        },
        modelsConfig: {
            llmConfig: {
                model: llmAgent.streaming_model,
                maxTokens: llmAgent.max_tokens,
                temperature: 0.2
            },
            asrConfig: {
                model: getOriginalModel(transcriber.model, "asr"),
                language: transcriber.language,
                samplingRate: parseInt(synthesizer.provider_config.sampling_rate),
                streaming: transcriber.stream,
                channels: 1
            },
            ttsConfig: {
                voice: synthesizer.provider_config.voice,
                bufferSize: synthesizer.buffer_size.toString(),
                streaming: synthesizer.stream
            }
        },
        engagementConfig: {
            channel: input.provider === "default" ? "Websocket" : input.provider,
            format: input.format
        },
        rulesConfig: {
            prompts: {
                assistantDescription: null,
                rules: null,
                exampleConversation: null,
                objections: null,
                faqs: null
            },
            graph: null
        },
        followUpTaskConfig: followupTaskConfig
    };
    console.log(`Form data ${JSON.stringify(formData)}`)
    return formData
}

export const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}


export const getDefaultSampleRate = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    audioContext.close();
    return sampleRate;
}

export const getVoiceLabel = (option) => {
    let label = option.name;
    if (option.accent) {
        // Replace parentheses format with a dash format
        const formattedAccent = option.accent.replace(/\(([^)]+)\)/, '- $1');

        label += ` (${formattedAccent}`;
        if (option.provider === 'xtts' || option.provider === 'elevenlabs') {
            label += `, emotive`;
        }
        label += `)`;
    }
    return label;
};
