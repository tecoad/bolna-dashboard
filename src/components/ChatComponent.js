import React, { useState, useEffect, useRef, useReducer } from 'react';
import { MessageBox, MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { Input, IconButton, Box, CircularProgress, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';


function ChatComponent({ agentId, isOpen, userId }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [recording, setRecording] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [wsConnected, setWsConnected] = useState(true);
    const ws = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    var incomingMessage = ""
    var i = 0

    function handleIncomingMessage(receivedMessage) {
        console.log(`Data ${receivedMessage} JSON Sata ${JSON.stringify(receivedMessage)}`)
        if (receivedMessage.data == '<beginning_of_stream>') {
            setIsTyping(true);
            incomingMessage = ""
        } else if (receivedMessage.data == '<end_of_stream>') {
            setIsTyping(false);
            console.log(`Before pushing ${incomingMessage}`)
            setMessages(prev => [...prev, { type: 'text', position: "left", text: incomingMessage, title: "AI" }]);
        } else {
            incomingMessage += receivedMessage.data;
        }
    }

    useEffect(() => {

        messages.forEach((m) => {
            console.log(`Logging mesages ${JSON.stringify(m)}`)
        })
        console.log("Hello " + i)
        i += 1
        console.log("Before websocket connection")

        if (!ws.current) {
            console.log("Starting websocket connection")
            ws.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/${userId}/${agentId}?user_agent=dashboard`);

            ws.current.addEventListener("open", () => {
                console.log('WebSocket Connected');
            });

            ws.current.addEventListener("message", (event) => {
                const receivedMessage = JSON.parse(event.data);
                handleIncomingMessage(receivedMessage)
            })

            ws.current.addEventListener("close", () => {
                console.log('WebSocket Disconnected')
                ws.current = null;
            });

            ws.current.addEventListener = ("error", (err) => {
                console.error('WebSocket Error:', err);
                ws.current.close()
                ws.current = null
            });
        };

        if (!isOpen) {
            ws.current.close()
            console.error('Closing websocket');
        }
    });



    const sendMessage = () => {
        if (message !== '') {
            const newMessage = { type: 'text', text: message, position: 'right', title: "You" };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        console.log(`Sending audio message`)

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            const base64AudioMessage = reader.result;
            ws.current.send(JSON.stringify({ "type": 'audio', "data": base64AudioMessage }));
        };

    };


    if (!wsConnected) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', mx: 'auto' }}>
            <Paper sx={{ flex: 1, overflow: 'auto', my: 2 }}>
                <MessageList
                    className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messages}
                />

                {isTyping && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                        <CircularProgress size={20} />
                    </Box>
                )}
            </Paper>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <Input
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    endAdornment={
                        <IconButton edge="end" color="primary" onClick={sendMessage}>
                            <SendIcon />
                        </IconButton>
                    }
                />
                <IconButton color="secondary" onClick={recording ? stopRecording : startRecording}>
                    {recording ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
            </Box>
        </Box >
    );
}

export default ChatComponent;
