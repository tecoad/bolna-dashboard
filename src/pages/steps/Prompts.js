import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import CustomTabs from '../../components/CustomTabs';
import PromptEditor from '../../components/PromptEditor';

function Prompts({ formData, onFormDataChange }) {

    const handleEditorChange = (key, content) => {
        console.log(`Current KEy ${key}`)
        onFormDataChange({
            ...formData, rulesConfig: { prompts: { ...formData.rulesConfig.prompts, [key]: content } }

        });
        console.log(`FORM DATA ${key} ${JSON.stringify(formData.rulesConfig.prompts)}`)
        console.log(`Text ${formData.rulesConfig.prompts[key]}`)
    };

    var lines = [
        { content: 'AI: Hello, am I speaking with {prospect_name}', editable: true },
        { content: 'User: Yes, who\'s this.', editable: false },
        { content: 'AI: I\'m Chaula from design your practice. Can I have a moment of your time? I\'m trying to understand problems that smaller architecture firms face in scaling', editable: true },
        { content: 'User: Yes sure.', editable: false },
        { content: '*Start editing from here*', editable: true },];

    var exampleConversation = lines.map(line => ({
        type: 'paragraph',
        children: [{ text: line.content, editable: line.editable }],
    }));

    console.log(`Example conversation ${JSON.stringify(exampleConversation)}`)

    if (formData.rulesConfig.prompts.exampleConversation != null) {
        exampleConversation = formData.rulesConfig.prompts.exampleConversation
    }

    var agentDesctiptionText = "Give a short description of the agent (You are Rohan, a sales agent for the company Sneakers Inc) \n Give a short description of the company (Sneakers Inc sells 2nd hand sneakers of leading brands like Nike, Adidas and New Balance) \n Give a short description of the primary intent (Your primary goal is to convince the user to buy sneakers from your company) \n Give a short brief of the major steps your agent has to follow (You have 3 primary tasks - To help find the right sneakers for the agent, to understand the shipping details, and to get them to confirm that they are interested in buying, following which you will send a whatsapp message with a purchase link) \n Give a short description of when the task is done (Your task is done either when the customer has agreed to buy a sneakers, or it is extremely clear that the user is not interested in talking to you or is annoyed by you)"
    var guidelinesAndRulesText = "Set manner rules for the agent (You will be friendly, warm and understanding. You will be mildly persuasive but never come off as annoying) \n Set conversation leading guidelines (You will lead the conversation, making sure the user answers one question clearly before moving to the next. You will stick to context. Any discussions outside context, you will steer back to the conversation) \n Set method of speaking rules for the agent (You will never speak more than 1-2 sentences. Keep answers short and crisp)\n Set company guidelines for the agent (You will never speak about competitors like Loafers Inc. You will never disclose anything about Sneakers Inc outside what is in your prompt)"
    var exampleConversationText = "Create a sample conversation in given format. \nIf you want to use OpenAI to create a template for you, add in all sections (Descriptions, Rules, Objections, Information) on to our custom GPT found on this link - <a href='https://chat.openai.com/g/g-MvczhoIRo-bolna-builder'>this link </a \n If you do not have GPT Plus, please enter in this prompt, followed by copy pasting all point onto your ChatGPT \n Your role is to help users build example conversations for voicebots. You'll use descriptions, rules, FAQs, and objections provided by the user to construct realistic and engaging dialogues. It's important to stick closely to the provided material, avoiding assumptions beyond what's given. Your conversations should reflect the intended use and capabilities of the voicebot. If anything is unclear in the user's requests, you should seek clarification to ensure accuracy and relevance. Your responses should emulate the tone and style described for the voicebot, offering personalized and contextually appropriate dialogues. Remember, your goal is to demonstrate how the voicebot might interact with users in various scenarios based on the training material."
    var possibleObjections = "How does your agent react to off-topic subjects? (How is the weather? ; The weather is great! What type sneakers do you feel like buying in this weather?) \n How does your agent react to controversial topics\n How does your agent handle unreasonable negotiation (I want a 50% discount on these sneakers ; I’m sorry but the maximum available discount on any of our products is 20%. Our products are top quality and look as good as new) \n How does your agent handle confusion (I am not sure if I want these now ; We have offers that are only available right now! Don’t miss out!) \n How does your agent handle edge cases (I live in Sydney ; Sorry, we only ship to India right now! Is there any local address we can send our product to?) \n How does your agent handle personal comments (You sound like an AI ; You’re right! I am an AI who’s sole purpose is to help you!)"
    var additionalInformation = "Detailed information about your company (Name, Location, Testimonials, Expertise, USP)\n Detailed information about your products (Sizes, Brands, Cost) \n Detailed information about the service (Time to deliver, areas you deliver in) \n Detailed information about discounts, reviews, or anything else you feel your agent should be equipped to answer"
    const tabsData = [
        { name: 'Agent Description', component: <PromptEditor identifier="assistantDescription" value={formData.rulesConfig.prompts.assistantDescription} onEditorDataChange={handleEditorChange} helperText={agentDesctiptionText} /> },
        { name: 'Guidelines and Rules', component: <PromptEditor value={formData.rulesConfig.prompts.rules} identifier={"rules"} onEditorDataChange={handleEditorChange} helperText={guidelinesAndRulesText} /> },
        { name: 'Example Conversation', component: <PromptEditor value={exampleConversation} identifier={"exampleConversation"} onEditorDataChange={handleEditorChange} helperText={exampleConversationText} /> },
        { name: 'Possible Objections', component: <PromptEditor value={formData.rulesConfig.prompts.objections} identifier={"objections"} onEditorDataChange={handleEditorChange} helperText={possibleObjections} /> },
        { name: 'Additional Information (FAQs)', component: <PromptEditor value={formData.rulesConfig.prompts.faqs} identifier={"faqs"} onEditorDataChange={handleEditorChange} helperText={additionalInformation} /> }
    ];

    return (
        <form>
            <Typography variant="h4" gutterBottom>Prompt Builder</Typography>
            <CustomTabs orientation={"vertical"} tabsData={tabsData} />


        </form>
    );
}

export default Prompts;
