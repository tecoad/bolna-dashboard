import React, { useState, useEffect, useRef, useReducer } from 'react';
import { MessageBox, MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { Input, IconButton, Box, CircularProgress, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { base64ToBlob, getDefaultSampleRate } from '../utils/utils';

const sampleRate = getDefaultSampleRate()

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



        if (receivedMessage.type == "text") {
            if (receivedMessage.data == '<beginning_of_stream>') {
                setIsTyping(true);
                incomingMessage = ""
            } else if (receivedMessage.data == '<end_of_stream>') {
                if (incomingMessage.length != 0) {
                    setIsTyping(false);
                    console.log(`Before pushing ${incomingMessage}`)
                    setMessages(prev => [...prev, { type: 'text', position: "left", text: incomingMessage, title: "AI" }]);
                } else {
                    console.log(`incoming message is null but still got end of stream`)
                }
            }
            else {
                incomingMessage += " " + receivedMessage.data;
            }
        } else if (receivedMessage.type == "audio") {
            console.log(`Got audio message`)
            const base64Audio = receivedMessage.data;
            const audioBlob = base64ToBlob(base64Audio, 'data:audio/mp3');
            const audioUrl = URL.createObjectURL(audioBlob);

            const audioMessage = {
                type: 'audio',
                position: "left",
                title: "AI",
                data: {
                    audioURL: audioUrl,
                },
            };
            setMessages(prev => [...prev, audioMessage]);
            setIsTyping(false);
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
        console.log(`sample rate ${sampleRate}`)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream, { type: 'audio/webm' });
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
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        console.log(`Sending audio message`)

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            var base64AudioMessage = reader.result;
            base64AudioMessage = base64AudioMessage.split(',')[1];
            console.log(`senfing ${base64AudioMessage}`);
            ws.current.send(JSON.stringify({ "type": 'audio', "data": base64AudioMessage }));
        };
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioMessage = {
            type: 'audio',
            position: "right",
            title: "You",
            data: {
                audioURL: audioUrl,
            },
        };
        setMessages(prev => [...prev, audioMessage]);
        setIsTyping(true)
    };

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
