import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import CustomTabs from '../../components/CustomTabs';
import PromptEditor from '../../components/PromptEditor';
import RunsTable from '../assistant-details/RunsTable';
import RequestLogs from '../assistant-details/RequestLogs';
import Analytics from '../assistant-details/Analytics';

function Prompts({ formData, onFormDataChange }) {
    const [openModal, setOpenModal] = useState({ type: '', open: false });

    const handleOpenModal = (type) => () => setOpenModal({ type, open: true });
    const handleCloseModal = () => setOpenModal({ type: '', open: false });


    //     onFormDataChange({
    //         ...formData,
    //         rulesConfig: {
    //             ...formData.rulesConfig,
    //             prompts: {
    //                 ...formData.modelsConfig[conf],
    //                 [event.target.name]: event.target.value
    //             }
    //         }
    //     });
    // };

    //     onFormDataChange({
    //         ...formData, engagementConfig: { ...formData.engagementConfig, [event.target.name]: event.target.value }

    //     });

    const handleEditorChange = (key, content) => {
        console.log(`Current KEy ${key}`)
        onFormDataChange({
            ...formData, rulesConfig: { prompts: { ...formData.rulesConfig.prompts, [key]: content } }

        });
        console.log(`FORM DATA ${key} ${JSON.stringify(formData.rulesConfig.prompts)}`)
    };

    const lines = [
        { content: 'This is an editable line.', editable: true },
        { content: 'This line is not editable.', editable: false },
        { content: 'This is an editable line.', editable: true },
        { content: 'This line is not editable.', editable: false },
        { content: '', editable: true },];

    const tabsData = [
        { name: 'Agent Description', component: <PromptEditor identifier="assistantDescription" value={formData.rulesConfig.prompts.assistantDescription} onEditorDataChange={handleEditorChange} /> },
        { name: 'Rules', component: <PromptEditor value={formData.rulesConfig.prompts.rules} identifier={"rules"} onEditorDataChange={handleEditorChange} /> },
        { name: 'Example Conversation', component: <PromptEditor value={lines} identifier={"exampleConversation"} onEditorDataChange={handleEditorChange} /> },
        { name: 'Objections', component: <PromptEditor value={formData.rulesConfig.prompts.objections} identifier={"objections"} onEditorDataChange={handleEditorChange} /> },
        { name: 'FAQs', component: <PromptEditor value={formData.rulesConfig.prompts.faqs} identifier={"faqs"} onEditorDataChange={handleEditorChange} /> }
    ];

    return (
        <form>
            <Typography variant="h4" gutterBottom>Prompt Settings</Typography>
            <CustomTabs orientation={"vertical"} tabsData={tabsData} />


        </form>
    );
}

export default Prompts;
