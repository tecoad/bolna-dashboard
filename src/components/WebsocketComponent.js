// import React, { useEffect, useState, useRef } from 'react';

// const WebsocketComponent = ({ agentId, accessToken, isOpen }) => {
//     const [audio, setAudio] = useState(null);
//     const socket = useRef(null);
//     const [loading, setLoading] = useState(true);
//     const mediaRecorder = useRef(null);

// const socket = useRef(null);

//     useEffect(() => {

//         if (!socket.current) {
//             alert("Starting connection")

//             socket.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/${agentId}?auth_token=${accessToken}`);

//             socket.current.addEventListener("open", () => {
//                 setLoading(false)
//                 console.log('WebSocket Connected');
//             });

//             socket.current.addEventListener("message", (event) => {
//                 const receivedMessage = JSON.parse(event.data);
//                 console.log(`Received message: ${receivedMessage}`);
//                 //handleIncomingMessage(receivedMessage)
//             })

//             socket.current.addEventListener("close", () => {
//                 console.log('WebSocket Disconnected')
//                 socket.current = null;
//             });

//             socket.current.addEventListener = ("error", (err) => {
//                 console.error('WebSocket Error:', err);
//                 socket.current.close()
//                 socket.current = null
//             });

//         }

//         if (!isOpen) {
//             socket.current.close()
//             console.error('Closing websocket');
//         }


//     }); // Dependencies added here




//     const startStreaming = async () => {

//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorder.current = new MediaRecorder(stream, { type: 'audio/webm' });
//             mediaRecorder.current.ondataavailable = (event) => {
//                 console.log("Convert the Blob to a Base64 string")
//                 audioData = event.data
//                 const reader = new FileReader();
//                 reader.readAsDataURL(event.data);
//                 reader.onloadend = () => {
//                     var base64AudioMessage = reader.result;
//                     base64AudioMessage = base64AudioMessage.split(',')[1];
//                     console.log(`sending ${base64AudioMessage}`);
//                     socket.current.send(JSON.stringify({ "type": 'audio', "data": base64AudioMessage }));
//                 };

//                 const message = JSON.stringify({ type: 'audio', data: audioData });
//                 console.log("Sending audio data");
//                 socket.current.send(message);

//             }
//             mediaRecorder.current.start();
//         }

//     };

//     // Helper function to convert Blob to Base64
//     const blobToBase64 = (blob) => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.readAsDataURL(blob);
//             reader.onloadend = () => {
//                 const base64data = reader.result.split(',')[1]; // Remove the Data URL prefix
//                 resolve(base64data);
//             };
//             reader.onerror = (error) => {
//                 reject(error);
//             };
//         });
//     };


//     return (
//         <div>
//             Websocket Component

//             <div>
//                 {
//                     loading ? (<> <p> Loading... </p> </>) : (<button onClick={startStreaming}>Start Streaming</button>)
//                 }

//             </div>

//         </div>
//     );
// };

// export default WebsocketComponent;


import React, { useState, useEffect, useRef } from 'react';

function WebsocketComponent({ agentId, accessToken, isOpen }) {
    const [audioStream, setAudioStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const socket = useRef(null);

    useEffect(() => {

        if (!socket.current) {
            alert("Starting connection")

            //socket.current = new WebSocket(`ws://localhost:5001/ws/audio`);
            socket.current = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/${agentId}?auth_token=${accessToken}&user_agent=webcall`);

            socket.current.addEventListener("open", () => {
                console.log('WebSocket Connected');
            });

            socket.current.addEventListener("message", (event) => {
                const receivedMessage = JSON.parse(event.data);
                console.log(`Received message: ${receivedMessage}`);
                //handleIncomingMessage(receivedMessage)
            })

            socket.current.addEventListener("close", () => {
                console.log('WebSocket Disconnected')
                socket.current = null;
            });

            socket.current.addEventListener = ("error", (err) => {
                console.error('WebSocket Error:', err);
                socket.current.close()
                socket.current = null
            });

        }

        if (!isOpen) {
            socket.current.close()
            console.error('Closing websocket');
        }


    }); // Dependencies added here


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);

        const recorder = new MediaRecorder(stream, { type: 'audio/webm' });
        recorder.ondataavailable = (event) => {
            console.log("AVAILABLE")
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                console.log('Sending audio data to server...');
                const reader = new FileReader();
                var audioBlob = event.data
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    var base64AudioMessage = reader.result;
                    base64AudioMessage = base64AudioMessage.split(',')[1];
                    console.log(`senfing ${base64AudioMessage}`);
                    socket.current.send(JSON.stringify({ "type": 'audio', "data": base64AudioMessage }));
                };
            }
        };

        recorder.start(100); // Split audio into chunks of 100 miliseconds
        setMediaRecorder(recorder);
    };

    const stopRecording = () => {
        console.log("Stopping")
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
