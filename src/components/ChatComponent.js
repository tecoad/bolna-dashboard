import React, { useState, useEffect, useRef, useReducer } from 'react';
import { MessageBox, MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { Input, IconButton, Box, CircularProgress, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

function ChatComponent({ agentId, userId }) {
    const [message, setMessage] = useState('');
    //const [messages, setMessages] = useState([]);
    const [recording, setRecording] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [ongoingMessage, setOngoingMessage] = useState([]);

    const [messages, dispatch] = useReducer(messagesReducer, []);

    function messagesReducer(state, action) {
        switch (action.type) {
            case 'addMessage':
                return [...state, action.payload];
        }
    }


    const ws = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    var msg = ""
    useEffect(() => {
        console.log("Hello")
        ws.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/${userId}/${agentId}?user_agent=dashboard`);

        ws.current.onopen = () => console.log('WebSocket Connected');
        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(`Data ${data} JSON Sata ${JSON.stringify(data)}`)
            if (data.data == '<beginning_of_stream>') {
                setIsTyping(true);
                msg = ""
            } else if (data.data == '<end_of_stream>') {
                setIsTyping(false);
                console.log(`Before pushing ${msg}`)
                dispatch({ type: 'addMessage', payload: msg });

                // setMessages((prevMessages) => [
                //     ...prevMessages,
                //     {
                //         position: 'left',
                //         type: 'text',
                //         message: msg
                //     },
                // ]);
                msg = ""
            } else {
                msg += data.data;
            }
        };
        ws.current.onclose = () => console.log('WebSocket Disconnected');
        ws.current.onerror = (error, err) => {
            console.error('WebSocket Error:', err);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);



    const sendMessage = () => {
        if (message !== '') {
            const newMessage = { type: 'text', message, position: 'right' };
            //setMessages((prevMessages) => [...prevMessages, newMessage]);
            dispatch({ type: 'addMessage', payload: newMessage });
            ws.current.send(JSON.stringify({ type: 'text', data: message }));
            setMessage('');
        }
    };

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = (event) => audioChunks.current.push(event.data);
            mediaRecorder.current.onstop = sendAudioMessage;
            audioChunks.current = [];
            mediaRecorder.current.start();
            setRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecording(false);
        }
    };

    const sendAudioMessage = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mpeg' });
        // Convert blob to file here and send via WebSocket
        // Example: ws.current.send(audioFile);
    };

    return (
        <Box sx={{ maxWidth: 600, height: 600, overflowY: 'scroll', margin: 'auto', p: 2 }}>
            <Paper sx={{ maxHeight: 500, overflowY: 'auto', p: 1 }}>

                <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                />
                {/* {messages.map((msg, index) => (
                    <MessageBox
                        key={index}
                        position={msg.position}
                        type={msg.type}
                        text={msg.message}
                        // Add custom styling for the message box here
                        style={{
                            margin: '5px',
                            borderRadius: '10px',
                            maxWidth: '70%',
                            alignSelf: msg.position === 'right' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.position === 'right' ? '#e0f7fa' : '#fff',
                        }}
                    />
                ))} */}
                {isTyping && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                        {/* Typing indicator, e.g., a spinner */}
                        <CircularProgress size={20} />
                    </Box>
                )}
            </Paper>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Input
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                />
                <IconButton onClick={sendMessage} color="primary">
                    <SendIcon />
                </IconButton>
                <IconButton onClick={recording ? stopRecording : startRecording} color="secondary">
                    {recording ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
            </Box>
        </Box>

    );
}

export default ChatComponent;
