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

function AgentFormStepper({ initialData, session }) {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialData);
    const [completed, setCompleted] = useState({});
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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
        var classification_prompt = `You're an helpful AI assistant who is tasked with classifying user's intent as per given conversations. Classify intent into following labels ${JSON.stringify(classification_labels)}.`
        if (examples.length > 0) {
            classification_prompt += `\n\n###Examples: ${examples}`
        }
        return classification_prompt
    }

    const translateToJSON = () => {
        let result = {};
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
                is_root: node.data.is_root,
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
        if (formData.basicConfig.agentType == "IVRType") {
            promptJson = translateToJSON();
            console.log("Flow Data:", JSON.stringify(promptJson));
        } else {
            promptJson["system_prompt"] = getPromptJsonFromRulesConfig(formData.rulesConfig.prompts)
            console.log(`Prompts JSON ${JSON.stringify(promptJson)} `)

        }

        console.log(`Sesssion ${JSON.stringify(session)} userID ${session.user.id}`)

        const payload = {
            "user_id": session.user.id.toString(),
            "assistant_config": transformedJson,
            "assistant_prompts": JSON.stringify({ "task_1": promptJson })
        }
        console.log(`Sending backkend reques to ${process.env.REACT_APP_FAST_API_BACKEND_URL}, json ${JSON.stringify(payload)}`)
        try {
            const response = await axios.post(`${process.env.REACT_APP_FAST_API_BACKEND_URL}/assistant`, payload);
            console.log(response.data); // handle response
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
