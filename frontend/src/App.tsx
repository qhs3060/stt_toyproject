// frontend/src/App.tsx

import React, { useState } from 'react';
import Recorder from './Recorder';
import axios from 'axios';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8000/stt/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setTranscription(response.data.text);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>STT Service</h1>
      <div>
        <h2>Upload an Audio File</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload and Transcribe</button>
        {transcription && (
          <div>
            <h2>Transcription:</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
      <div style={{ marginTop: "40px" }}>
        <h2>Real-time Audio Recording</h2>
        <Recorder />
      </div>
    </div>
  );
};

export default App;