import { useRef } from 'react'

export const useAudioStream = (sendBlob, timeSlice = 500) => {
    const mediaStreamRef = useRef < MediaStream | null > (null)
    const mediaRecorderRef = useRef < MediaRecorder | null > (null)
    const captureUserAudio = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            mediaStreamRef.current = stream
            mediaRecorder.start(timeSlice)
            mediaRecorder.addEventListener('dataavailable', (blobEvent) => {
                sendBlob(blobEvent.data)
            })
        })
    }
    const startStream = () => {
        captureUserAudio()
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current?.start()
        }
    }
    const stopStream = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => {
                if (track.readyState === 'live' && track.kind === 'audio') {
                    track.stop()
                }
            })
        }
    }

    return {
        startStream,
        stopStream,
    }
}