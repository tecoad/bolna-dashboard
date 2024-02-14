import { Typography, Box } from '@mui/material';
import React, { useMemo, useState, useCallback } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';


const StructuredText = () => {
    return (
        <Box sx={{ ml: 3 }}>
            <Typography variant="body1">
                1. Create a sample conversation in this format
            </Typography>
            <Box sx={{ ml: 3 }}>
                <Typography variant="body1">AI - Hello, welcome to Sneakers Inc</Typography>
                <Typography variant="body1">User - Hello, I wanted to buy Sneakers</Typography>
                <Typography variant="body1">AI - Sure! ….</Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 2 }}>
                2. If you want to use OpenAI to create a template for you, add in all sections (Descriptions, Rules, Objections, Information) on to our custom GPT found on this link - <a href="https://chat.openai.com/g/g-MvczhoIRo-bolna-builder">https://chat.openai.com/g/g-MvczhoIRo-bolna-builder</a>
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
                3. If you do not have GPT Plus, please enter in this prompt, followed by copy pasting all sections onto your ChatGPT
            </Typography>
            <Box sx={{ ml: 3 }}>
                <Typography variant="body1">
                    1. Your role is to help users build example conversations for voicebots. You'll use descriptions, rules, FAQs, and objections provided by the user to construct realistic and engaging dialogues. It's important to stick closely to the provided material, avoiding assumptions beyond what's given. Your conversations should reflect the intended use and capabilities of the voicebot. If anything is unclear in the user's requests, you should seek clarification to ensure accuracy and relevance. Your responses should emulate the tone and style described for the voicebot, offering personalized and contextually appropriate dialogues. Remember, your goal is to demonstrate how the voicebot might interact with users in various scenarios based on the training material.
                </Typography>
            </Box>
        </Box>
    );
}



const PromptEditor = ({ value, identifier, onEditorDataChange, helperText }) => {
    const editor = useMemo(() => withReact(createEditor()), []);

    const initialValue = value ? value : [{ type: 'paragraph', editable: true, children: [{ text: '', editable: true }] }];
    const [editorValue, setEditorValue] = useState(initialValue);

    const handleChange = (value) => {
        setEditorValue(value);
        onEditorDataChange(identifier, value);
    };

    const helperItems = helperText.split('\n').map((item, index) => (
        <li key={index}>{item}</li>
    ));


    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    return (
        <>
            <Slate editor={editor} value={editorValue} initialValue={editorValue} onChange={handleChange}>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    style={{
                        border: '1px solid #ddd',
                        padding: '10px',
                        minHeight: '150px', // Minimum height of the editor
                        minWidth: '300px', // Minimum width of the editor
                        maxWidth: '100%', // Ensuring the editor does not exceed the width of its container
                        color: 'black' // Default text color
                    }}
                />
            </Slate>

            <Typography variant='h5' gutterBottom sx={{ marginTop: 3 }}> Helpful Tips </Typography >

            {
                helperText && identifier != "exampleConversation" && (
                    <Typography component="ul" sx={{ mt: 2 }}>
                        {helperItems}
                    </Typography>
                )
            }


            {
                helperText && identifier == "exampleConversation" && (
                    <StructuredText />
                )
            }
        </>

    );
};

const Element = ({ attributes, children, element }) => {
    return (
        <p
            {...attributes}
            contentEditable={element.editable}
            style={{ color: element.editable ? 'black' : 'grey' }}
        >
            {children}
        </p>
    );
};


const Leaf = ({ attributes, children, leaf }) => {
    return (
        <span {...attributes} style={{ color: leaf.editable ? 'black' : 'grey' }}>
            {children}
        </span>
    );
};

export default PromptEditor;
