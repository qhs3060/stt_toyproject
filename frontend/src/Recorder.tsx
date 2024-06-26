// frontend/src/Recorder.tsx

import React, { useState, useRef } from 'react';
import axios from 'axios';

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          audioChunksRef.current = []; // Clear the chunks for the next recording
          
          // Create a link to download the MP3 file
          const url = URL.createObjectURL(audioBlob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `recording_${Date.now()}.mp3`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);

          // Send the file to the backend for STT
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.mp3');

          try {
            const response = await axios.post('http://localhost:8000/realtime_stt/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            console.log("Transcription:", response.data.text);
          } catch (error) {
            console.error('Error:', error);
          }
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
    </div>
  );
};

export default Recorder;