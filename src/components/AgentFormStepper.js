import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, StepButton } from '@mui/material';
import BasicConfiguration from '../pages/steps/BasicConfiguration'; // Import your step components
import EngagementSettings from '../pages/steps/EngagementSettings';
import RulesSettings from '../pages/steps/RulesSettings';
import FollowUpTasks from '../pages/steps/FollowUpTasks';
import Prompts from '../pages/steps/Prompts';
import ModelSettings from '../pages/steps/ModelSettings';
import { useNodesState, useEdgesState } from 'react-flow-renderer';
import { convertToCreateAgentPayload, convertToText } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';

function AgentFormStepper({ initialData, userId, isUpdate, agentId }) {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialData);
    const [completed, setCompleted] = useState({})
    const defaultRootNode = {
        id: 'root-node',
        type: 'default',
        data: { label: 'intro', content: 'Am I speaking with {}', examples: '', isRoot: true },
        position: { x: 250, y: 5 },
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(initialData.basicConfig.assistantType == "IVR" ? initialData.rulesConfig?.graph?.nodes : [defaultRootNode]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.basicConfig.assistantType == "IVR" ? initialData.rulesConfig?.graph?.edges : []);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const steps = ['Agent Details', 'Settings', 'Engagement', 'Rules', 'Follow-up Tasks'];

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
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getPrompt = (examples, classification_labels) => {
        var classification_prompt = `You're an helpful AI assistant who is tasked with classifying user's intent as per given conversations. Classify intent into following labels ${JSON.stringify(classification_labels)} Always respond in json format with following structure {classification_label : the label you'd classify the given text as}.`
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

        // Download result as JSON file

        return result;
    };

    const getPromptJsonFromRulesConfig = (prompts) => {
        var base_prompt = `You're an helpful assistant that is helping me roleplay. Find details for the role play like Assistant description, steps to follow while holding a conversation, rules to follow and objections that can be raised.

            ### Assistant Description
         ${convertToText(prompts['assistantDescription'])} 
        `
        if (prompts['steps'] != null && prompts['steps'] != undefined) {
            base_prompt += `\n ### Steps
            ${convertToText(prompts['steps'])}`
        }

        if (prompts['rules'] != null && prompts['rules'] != undefined) {
            base_prompt += `\n ### Rules
            ${convertToText(prompts['rules'])}`
        }

        if (prompts['objections'] != null && prompts['objections'] != undefined) {
            base_prompt += `\n ### Objections
            ${convertToText(prompts['objections'])}`
        }

        if (prompts['faqs'] != null && prompts['faqs'] != undefined) {
            base_prompt += `\n ### FAQs
            ${convertToText(prompts['faqs'])}`
        }

        return base_prompt;
    }

    const handleComplete = async () => {
        setLoading(true);
        console.log("Form Data:", JSON.stringify(formData));
        let transformedJson = convertToCreateAgentPayload(formData)
        console.log(`Transformed JSON ${JSON.stringify(transformedJson)} `)
        let promptJson = {}

        let payload = {
            "user_id": userId.toString(),
            "assistant_config": transformedJson,
        }
        console.log(`formData.basicConfig.agentType ${formData.basicConfig.assistantType} `)
        if (formData.basicConfig.assistantType == "IVR") {
            promptJson = translateToJSON();
            console.log("Flow Data:", JSON.stringify(promptJson));

            // a hacky way to serialize and deserialize on the frontend to save development time
            payload = {
                ...payload,
                "assistant_prompts": {
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
            promptJson["system_prompt"] = getPromptJsonFromRulesConfig(formData.rulesConfig.prompts)
            console.log(`Prompts JSON ${JSON.stringify(promptJson)} `)
            payload = {
                ...payload, "assistant_prompts": {
                    "serialized_prompts": JSON.stringify({ "task_1": promptJson }),
                    "deserialized_prompts": JSON.stringify({ "task_1": formData.rulesConfig.prompts })
                }
            }
        }

        console.log(`Sending backkend reques to ${process.env.REACT_APP_FAST_API_BACKEND_URL}, agentID ${agentId} json ${JSON.stringify(payload)}`)
        try {
            if (isUpdate) {
                const response = await axios.put(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/assistant/${agentId}`, payload);
                console.log(response.data); // handle response

            } else {
                const response = await axios.post(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/assistant`, payload);
                console.log(response.data); // handle response

            }
            navigate('/dashboard/my-agents');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation error:', error.response.data);
            } else {
                console.error('Error during API call', error);
            }
        } finally {
            setLoading(false); // Stop loading regardless of the outcome
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
                return <ModelSettings formData={formData} onFormDataChange={handleFormDataChange} />;
            case 2:
                return <EngagementSettings formData={formData} onFormDataChange={handleFormDataChange} />;
            case 3:
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
            case 4:
                return <FollowUpTasks formData={formData} onFormDataChange={handleFormDataChange} />;
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
