import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, StepButton } from '@mui/material';
import BasicConfiguration from '../pages/steps/BasicConfiguration'; // Import your step components
import RulesSettings from '../pages/steps/RulesSettings';
import FollowUpTasks from '../pages/steps/FollowUpTasks';
import ModelSettings from '../pages/steps/ModelSettings';
import { useNodesState, useEdgesState } from 'react-flow-renderer';
import { convertToCreateAgentPayload, convertToText } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import createApiInstance from '../utils/api';
import { Mixpanel } from '../utils/mixpanel';

function AgentFormStepper({ initialData, isUpdate, agentId, accessToken }) {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialData);
    const [completed, setCompleted] = useState({})
    const [voices, setVoices] = useState([]);
    const [llmModels, setLLMModels] = useState([]);
    const api = createApiInstance(accessToken);

    const defaultRootNode = {
        id: 'root-node',
        type: 'default',
        data: { label: 'intro', content: 'Am I speaking with {}', examples: '', isRoot: true },
        position: { x: 250, y: 5 },
    };

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true);
            try {
                //const response = await axios.get(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/user/models?user_id=${userId}`);
                const response = await api.get('/get_all_voices');
                setVoices(response.data.voices);
                setLLMModels(response.data.llmModels);
                //console.log(`Voices ${JSON.stringify(response.data)}`)
            } catch (error) {
                console.error('Error fetching agents Msking loading false:', error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchModels();
        }

    }, [accessToken]);

    var selectedVoice = null
    var selectedLLMModel = null
    if (initialData.modelsConfig.ttsConfig.voice != '') {
        selectedVoice = voices.find(voice => voice.name === initialData.modelsConfig.ttsConfig.voice)
        selectedLLMModel = llmModels.find(model => model.model.includes(initialData.modelsConfig.llmConfig.model))
    }

    if (initialData.modelsConfig.ttsConfig.voice == '' && voices.length != 0) {
        selectedVoice = voices[0]
        const initialModel = initialData.basicConfig.assistantType == "IVR" ? "gpt-3.5-turbo-1106" : "gpt-3.5-turbo-16k"
        selectedLLMModel = llmModels.filter(model => model.model == initialModel)[0] // Make sure initially selected model is a gpt-3.5 one
        //console.log(`Setting voice to ${voices[0].name}`)
        initialData.modelsConfig.ttsConfig.voice = voices[0].name;
        initialData.modelsConfig.llmConfig.model = selectedLLMModel.model;
        initialData.modelsConfig.llmConfig.family = selectedLLMModel.family;
    }


    const [nodes, setNodes, onNodesChange] = useNodesState(initialData.basicConfig.assistantType == "IVR" ? initialData.rulesConfig?.graph?.nodes : [defaultRootNode]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.basicConfig.assistantType == "IVR" ? initialData.rulesConfig?.graph?.edges : []);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const steps = ['Agent Details', 'Rules', 'Follow-up Tasks', 'Advanced Settings'];

    const activeStepLabelStyle = {
        color: 'primary.main',
        fontWeight: 'bold',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        padding: '6px 16px',
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleNext = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        if (activeStep === steps.length - 1) {
            handleComplete()
        }

        Mixpanel.track('click_next', {
            item: activeStep
        });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        Mixpanel.track('click_previous');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getPrompt = (examples, classification_labels) => {
        var classification_prompt = `You're an helpful AI assistant who is tasked with classifying user's intent as per given conversations. Classify intent into following labels ${JSON.stringify(classification_labels)}. ### Rules for classification Always respond in json format with following structure {classification_label : the label you'd classify the given text as}.`
        if (examples.length > 0) {
            classification_prompt += `\n\n###Examples: ${examples}`
        }
        return classification_prompt
    }

    const translateToJSON = () => {
        let result = {};
        var got_root = false;
        nodes.forEach(node => {
            // Find children nodes
            const childrenNodes = edges.filter(edge => edge.source === node.id).map(edge => edge.target);
            // Get classification labels from children nodes
            let classificationLabels = childrenNodes.map(childId => {
                const childNode = nodes.find(n => n.id === childId);
                return childNode ? childNode.data.label : '';
            });

            var prompt = getPrompt(node.data.examples, classificationLabels);
            result[node.id] = {
                label: node.data.label,
                children: childrenNodes,
                content: [{ "text": node.data.content }],
                is_root: node.data.isRoot == true ? true : false,
                prompt: prompt,
                classification_labels: classificationLabels
            };
        });
        return result;
    };

    const getPromptJsonFromRulesConfig = (prompts, is7BModel = false, isOpenAI) => {

        var base_prompt = `
            ### Agent Description
         ${convertToText(prompts['assistantDescription'])} 
        `
        if (prompts['exampleConversation'] != null && prompts['exampleConversation'] != undefined && prompts['exampleConversation'].length == 1 && prompts['exampleConversation']['children']) {
            alert(JSON.stringify(prompts['exampleConversation']))
            base_prompt += `\n ### Steps
            ${convertToText(prompts['exampleConversation'])}`
        }

        if (prompts['rules'] != null && prompts['rules'] != undefined && prompts['rules'].length != 0 && prompts['rules'].length == 1 && prompts['rules']['children']) {
            base_prompt += `\n ### Rules
            ${convertToText(prompts['rules'])}`
        }

        if (prompts['objections'] != null && prompts['objections'] != undefined && prompts['objections'].length != 0 && prompts['objections'].length == 1 && prompts['objections']['children']) {
            base_prompt += `\n ### Objections
            ${convertToText(prompts['objections'])}`
        }

        if (prompts['faqs'] != null && prompts['faqs'] != undefined && prompts['faqs'].length != 0 && prompts['faqs'].length == 1 && prompts['faqs']['children']) {
            base_prompt += `\n ### FAQs
            ${convertToText(prompts['faqs'])}`
        }

        base_prompt += `\n ### Note: \n 1. Just respond with one message at time. Always wait for user responses.`

        console.log(`BASE PROMPT ${base_prompt}`)
        return base_prompt;
    }

    const handleComplete = async () => {
        setLoading(true);
        //console.log("Form Data:", JSON.stringify(formData));
        let transformedJson = convertToCreateAgentPayload(formData)
        //console.log(`Transformed JSON ${JSON.stringify(transformedJson)} `)
        let promptJson = {}

        let payload = {
            //"user_id": userId.toString(),
            "agent_config": transformedJson,
        }
        //console.log(`formData.basicConfig.agentType ${formData.basicConfig.assistantType} `)
        if (formData.basicConfig.assistantType == "IVR") {
            promptJson = translateToJSON();
            //console.log("Flow Data:", JSON.stringify(promptJson));

            // a hacky way to serialize and deserialize on the frontend to save development time
            payload = {
                ...payload,
                "agent_prompts": {
                    "serialized_prompts": JSON.stringify({ "task_1": promptJson }),
                    "deserialized_prompts": JSON.stringify({
                        "task_1": {
                            "nodes": nodes,
                            "edges": edges,
                        }
                    })
                }
            }
        } else {
            const is7BModel = formData.modelsConfig.llmConfig.model.includes("7b") ? true : false
            const isOpenAI = formData.modelsConfig.llmConfig.family.includes("openai") ? true : false
            promptJson["system_prompt"] = getPromptJsonFromRulesConfig(formData.rulesConfig.prompts, is7BModel, isOpenAI)
            //console.log(`Prompts JSON ${JSON.stringify(promptJson)} `)
            payload = {
                ...payload, "agent_prompts": {
                    "serialized_prompts": JSON.stringify({ "task_1": promptJson }),
                    "deserialized_prompts": JSON.stringify({ "task_1": formData.rulesConfig.prompts })
                }
            }
        }

        //console.log(`Sending backkend request to ${process.env.REACT_APP_FAST_API_BACKEND_URL}, agentID ${agentId} json ${JSON.stringify(payload)}`)
        try {
            if (isUpdate) {
                //console.log(`PAYLOAD ${JSON.stringify(payload)}`);
                const response = await api.put(`/agent/${agentId}`, payload);
                //console.log(response.data);

            } else {
                //console.log(JSON.stringify(payload));
                const response = await api.post('/agent', payload);
                //console.log(response.data);
            }
            navigate('/dashboard/my-agents');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation error:', error.response.data);
            } else {
                console.error('Error during API call', error);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleFormDataChange = (newData) => {
        setFormData({ ...formData, ...newData });
    };

    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return <BasicConfiguration formData={formData} onFormDataChange={handleFormDataChange} />;
            case 1:
                return <RulesSettings
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                    nodes={nodes}
                    setNodes={setNodes}
                    edges={edges}
                    setEdges={setEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                />
            case 2:
                return <FollowUpTasks formData={formData} onFormDataChange={handleFormDataChange} />;
            case 3:
                return <ModelSettings accessToken={accessToken} formData={formData} onFormDataChange={handleFormDataChange} llmModels={llmModels} voices={voices} setVoices={setVoices} initiallySelectedVoice={selectedVoice} initiallySelectedModel={selectedLLMModel} />;
            default:
                return 'Unknown step';
        }
    }

    return (
        <Box sx={{ width: '100%' }}>

            {
                loading ? (
                    <>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
                            open={loading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                    </>
                ) : (
                    <>
                        <Stepper nonLinear activeStep={activeStep}>
                            {steps.map((label, index) => (
                                <Step key={label} completed={completed[index]}>
                                    <StepButton onClick={handleStep(index)}>
                                        <StepLabel
                                            sx={activeStep === index ? activeStepLabelStyle : {}}
                                        >
                                            {label}
                                        </StepLabel>
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                        <div>
                            {activeStep === steps.length ? (
                                <div>
                                    <Typography>All steps completed</Typography>
                                    <Button onClick={handleComplete}>Complete</Button> {/* Changed from handleReset to handleComplete */}
                                </div>
                            ) : (
                                <div>
                                    <br />
                                    <br />
                                    <Typography>{getStepContent(activeStep)}</Typography>
                                    <br />
                                    <br />
                                    <div sx={{ alignItems: "right" }}>
                                        <Button disabled={activeStep === 0} onClick={handleBack}>
                                            Back
                                        </Button>
                                        <Button variant="contained" onClick={handleNext}>
                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )
            }

        </Box>
    );
}

export default AgentFormStepper;
