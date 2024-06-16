// frontend/src/Recorder.tsx

import React, { useState, useRef } from 'react';

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          audioChunksRef.current = [];

          // 파일을 백엔드로 전송
          const formData = new FormData();
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // 파일 이름에 사용할 타임스탬프
          formData.append('file', audioBlob, `recording_${timestamp}.mp3`);

          fetch('http://localhost:8000/record/', {
            method: 'POST',
            body: formData,
          })
          .then(response => response.json())
          .then(data => setTranscription(data.text))
          .catch(error => console.error('Error:', error));
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
    <div style={{ padding: "20px" }}>
      <h1>Audio Recorder</h1>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      {audioURL && <audio src={audioURL} controls />}
      {transcription && (
        <div>
          <h2>Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default Recorder;