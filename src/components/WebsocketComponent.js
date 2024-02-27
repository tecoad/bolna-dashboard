import React, { useState, useEffect, useRef } from 'react';
import { base64ToBlob, base64ToArrayBuffer } from '../utils/utils';
import { decodeWav } from 'wav-decoder';

function WebsocketComponent({ agentId, accessToken, isOpen }) {
    const [audioStream, setAudioStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [sourceBuffer, setSourceBuffer] = useState(null);
    const audioContext = useRef(null);
    const sampleRate = 24000; // Sample rate of the audio data

    const audioQueue = useRef([]);
    const nextStartTime = useRef(0); // Keep track of when the next audio chunk should start playing
    const source = useRef(null)

    const socket = useRef(null);

    const processQueue = () => {
        if (audioQueue.current.length > 0) {
            const arrayBuffer = audioQueue.current.shift();

            audioContext.current.decodeAudioData(arrayBuffer, (decodedData) => {
                // Create a new AudioBufferSourceNode for each decoded audio data
                const newSource = audioContext.current.createBufferSource();
                newSource.buffer = decodedData;
                newSource.connect(audioContext.current.destination);
                const currentTime = audioContext.current.currentTime;
                const startTime = nextStartTime.current > currentTime ? nextStartTime.current : currentTime;
                newSource.start(startTime);
                nextStartTime.current = startTime + newSource.buffer.duration;
                source.current = newSource
                processQueue();
            }, (error) => {
                console.error('Error with decoding audio data', error);
                processQueue();
            });
        }
    };


    useEffect(() => {
        if (!audioContext.current) {
            audioContext.current = new AudioContext({ sampleRate });
            source.current = audioContext.current.createBufferSource();
        }

        if (!socket.current) {
            //socket.current = new WebSocket(`ws://localhost:5001/ws/audio`);
            socket.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/${agentId}?auth_token=${accessToken}&user_agent=dashboard&enforce_streaming=true`);

            socket.current.addEventListener("open", () => {
                console.log('WebSocket Connected');
            });

            socket.current.addEventListener("message", async (event) => {
                const receivedMessage = JSON.parse(event.data);
                if (receivedMessage.type == "audio") {
                    const base64Audio = receivedMessage.data;
                    const base64AudioData = `${base64Audio}`;
                    const arrayBuffer = base64ToArrayBuffer(base64AudioData);
                    const arrayBufferDeepCopy = arrayBuffer.slice(0)// Create a deep copy of so that decoded version is not affected by any other operations
                    audioQueue.current.push(arrayBufferDeepCopy);

                    // If this is the first chunk, or if we're currently not processing the queue, start the processing
                    if (audioQueue.current.length === 1) {
                        console.log("PRocessing as length is 1")
                        processQueue();
                    }
                } else {
                    if (receivedMessage.type == "clear") {

                        if (source.current) {
                            source.current.stop();
                            source.current.disconnect();
                        }
                        audioQueue.current = [];
                        nextStartTime.current = 0;
                        source.current = audioContext.current.createBufferSource();

                    }
                }

            })

            socket.current.addEventListener("close", () => {
                console.log('WebSocket Disconnected')
                socket.current = null;
            });

            socket.current.addEventListener = ("error", (err) => {
                console.error('WebSocket Error:', err);
                socket.current.close()
                audioContext.current.close();
                socket.current = null
            });
        }

        if (!isOpen) {
            socket.current.close()
            audioContext.current.close();
            console.error('Closing websocket');
        }


    });


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);

        const recorder = new MediaRecorder(stream, { type: 'audio/webm' });
        recorder.ondataavailable = (event) => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                const reader = new FileReader();
                var audioBlob = event.data
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    var base64AudioMessage = reader.result;
                    base64AudioMessage = base64AudioMessage.split(',')[1];
                    socket.current.send(JSON.stringify({ "type": 'audio', "data": base64AudioMessage }));
                };
            }
        };

        recorder.start(200); // Split audio into chunks of 200 miliseconds
        setMediaRecorder(recorder);
    };

    const stopRecording = () => {
        console.log("Stopping")
        socket.current.close()
        console.log("Connection stopped")
        mediaRecorder.stop();
        audioStream.getTracks().forEach(track => track.stop());
    };

    return (
        <div>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
        </div>
    );
}

export default WebsocketComponent;