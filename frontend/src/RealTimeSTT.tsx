// frontend/src/RealTimeSTT.tsx

import React, { useState, useRef } from 'react';
import axios from 'axios';

const RealTimeSTT: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
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

          // Send the file to the backend for STT and save it
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.mp3');

          try {
            const response = await axios.post('http://localhost:8000/realtime_stt/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            setTranscription(response.data.text);

            // Log the file location where the MP3 is saved
            console.log('File saved at:', response.data.file_location);
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

  const handleTranscriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscription(event.target.value);
  };

  const handleConfirm = async () => {
    // STT 결과를 데이터베이스에 저장
    try {
      const response = await axios.post('http://localhost:8000/save_transcription/', {
        transcription: transcription
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Transcription saved successfully!');
    } catch (error) {
      console.error('Error saving transcription:', error);
      alert('Error saving transcription!');
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Real-time STT</h1>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      <div style={{ marginTop: "20px" }}>
        <h2>Transcription:</h2>
        <textarea
          value={transcription}
          onChange={handleTranscriptionChange}
          style={{ width: "100%", height: "200px" }}
        />
        <button onClick={handleConfirm}>Confirm and Save</button>
      </div>
    </div>
  );
};

export default RealTimeSTT;