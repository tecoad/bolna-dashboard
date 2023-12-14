import React, { useMemo, useState, useCallback } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const PromptEditor = ({ value, identifier, onEditorDataChange }) => {
    console.log(`INITIAL VALUE ${JSON.stringify(value)}`)
    const editor = useMemo(() => withReact(createEditor()), []);

    const initialValue = value ? value : [{ type: 'paragraph', editable: true, children: [{ text: '', editable: true }] }];
    const [editorValue, setEditorValue] = useState(initialValue);

    const handleChange = (value) => {
        setEditorValue(value);
        onEditorDataChange(identifier, value);
        console.log(`Stored ${JSON.stringify(value)}`)
    };


    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    return (
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
    console.log(`${JSON.stringify(leaf.text)} leaf.editable ${leaf.editable}? `)
    return (
        <span {...attributes} style={{ color: leaf.editable ? 'black' : 'grey' }}>
            {children}
        </span>
    );
};

export default PromptEditor;
