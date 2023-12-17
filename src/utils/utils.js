
export const CREATE_AGENT_FORM = {
    basicConfig: {
        assistantType: "FreeFlowing",
        assistantName: null,
        assistantTask: null
    },
    modelsConfig: {
        llmConfig: {
            model: 'GPT-3.5',
            maxTokens: 100,
            temperature: 0.2
        },
        asrConfig: {
            model: 'Nova-2',
            language: 'en',
            samplingRate: 8000,
            streaming: true,
            channels: 1
        },
        ttsConfig: {
            voice: 'Mark',
            bufferSize: '40',
            streaming: true
        }
    },
    engagementConfig: {
        channel: 'websocket',
        format: 'mp3'
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
        tasks: null,
        notificationDetails: {
            mechanisms: [],
            emailTemplate: null,
            whatsappTemplate: null,
            smsTemeplate: null,
        },
        extractionDetails: null
    }
}

function getModelFromVoice(voice) {
    return "polly"
}
function getModel(model, modelType, assistantType) {
    if (modelType === "llm") {
        if (assistantType == "IVRAgent") {
            model = model.toLowerCase() == "gpt-3.5" ? "gpt-3.5-turbo-1106" : "gpt-4-1106-previe"
        } else {
            model = model.toLowerCase() == "gpt-3.5" ? "gpt-3.5-turbo-16k" : model.toLowerCase()
        }
        console.log(`Model ${model}`)
        return model
    } else if (modelType === "tts") {
        return getModelFromVoice(model)
    } else {
        model = model == "Nova-2" ? "deepgram" : model;
        return model
    }
}

const getToolsConfig = (taskType, extraConfig) => {

    var llm_task_config = {
        "tools_config": {
            "llm_agent": {
                "max_tokens": 100,
                "family": "openai",
                "request_json": true
            },

            "output": {
                "provider": "database",
                "format": "json"
            }
        },
    }
    if (taskType === "notification") {
        var apiTools = {}
        extraConfig.mechanisms.forEach(mech => {
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
        return apiTools
    } else if (taskType === "extraction") {
        llm_task_config.toolsConfig.llmAgent.streaming_model = "gpt-4-1106-preview"
        llm_task_config.toolsConfig.llmAgent.extractionDetails = extraConfig
    } else {
        llm_task_config.toolsConfig.llmAgent.streaming_model = "gpt-4"
    }

    return llm_task_config
}
const getJsonForTaskType = (taskType, extraConfig) => {
    var toolChainSequence = taskType == "notification" ? "api_tools" : "llm"
    let taskStructure = {
        "agent_task": `${taskType}`,

        "toolchain": {
            "execution": "parallel",
            "toolsConfig": getToolsConfig(taskType, extraConfig),
            "pipelines": [
                [
                    `${toolChainSequence}`
                ]
            ]
        }
    }
    return taskStructure
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
                        "family": "openai",
                        "streaming_model": getModel(agentData.modelsConfig.llmConfig.model, "llm", agentData.basicConfig.assistantType),
                        "agent_flow_type": agentData.basicConfig.assistantType === "IVR" ? "preprocessed" : "streaming",
                        "classification_model": getModel(agentData.modelsConfig.llmConfig.model, "llm", agentData.basicConfig.assistantType),
                        "use_fallback": true,
                    },
                    "synthesizer": {
                        "model": getModel(agentData.modelsConfig.ttsConfig.voice, "tts"),
                        "stream": agentData.modelsConfig.ttsConfig.streaming,
                        "voice": agentData.modelsConfig.ttsConfig.voice,
                        "language": agentData.modelsConfig.asrConfig.language,
                        "buffer_size": parseInt(agentData.modelsConfig.ttsConfig.bufferSize),
                        "audio_format": agentData.engagementConfig.format,
                        "sampling_rate": agentData.modelsConfig.asrConfig.samplingRate.toString()
                    },
                    "transcriber": {
                        "model": getModel(agentData.modelsConfig.asrConfig.model, "asr"),
                        "stream": agentData.modelsConfig.asrConfig.streaming,
                        "language": agentData.modelsConfig.asrConfig.language
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

    if (agentData.followUpTasks.selectedTasks.length > 0) {
        // Figure out extra config 
        // Once that is done check Create
        // 

        agentData.followUpTasks.selectedTasks.forEach(task => {
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
    }).join('');
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

export const convertToCreateAgentForm = (payload) => {
    const agentData = payload.tasks[0];
    const llmAgent = agentData.tools_config.llm_agent;
    const synthesizer = agentData.tools_config.synthesizer;
    const transcriber = agentData.tools_config.transcriber;
    const input = agentData.tools_config.input;

    return {
        basicConfig: {
            assistantType: llmAgent.agent_flow_type === "preprocessed" ? "IVR" : "FreeFlowing",
            assistantName: payload.assistant_name,
            assistantTask: payload.assistant_type
        },
        modelsConfig: {
            llmConfig: {
                model: getOriginalModel(llmAgent.streaming_model, "llm", llmAgent.agent_flow_type),
                maxTokens: llmAgent.max_tokens,
                temperature: 0.2
            },
            asrConfig: {
                model: getOriginalModel(transcriber.model, "asr"),
                language: transcriber.language,
                samplingRate: parseInt(synthesizer.sampling_rate),
                streaming: transcriber.stream,
                channels: 1
            },
            ttsConfig: {
                voice: synthesizer.voice,
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
        followUpTasks: {
            tasks: null
        }
    };
}
