// frontend/src/App.tsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress } from '@mui/material';
import Table2Data from './Table2Data';
import Recorder from './Recorder';
import RealTimeSTT from './RealTimeSTT';
import Table1Data from './Table1Data';
import axios from 'axios';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/stt/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // 파일 업로드 후 STT 결과 폴링 시작
        const fileName = file.name;
        const pollSTTResult = async () => {
          try {
            const resultResponse = await axios.get(`http://localhost:8000/stt_result/${fileName}`);
            setTranscription(resultResponse.data.text);
            setLoading(false);
          } catch (error) {
            console.error("Error polling STT result:", error);
            setTimeout(pollSTTResult, 2000); // 2초 후에 다시 시도
          }
        };

        pollSTTResult();

      } catch (error) {
        console.error("Error uploading file:", error);
        setLoading(false);
      }
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            STT Service
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/realtime">Real-time STT</Button>
          <Button color="inherit" component={Link} to="/table2">Table2 Data</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={
            <Box style={{ padding: "20px" }}>
              <Typography variant="h4" gutterBottom>
                STT Service Home
              </Typography>
              <div>
                <h2>Upload an Audio File</h2>
                <input type="file" onChange={handleFileChange} />
                <Button onClick={handleUpload} variant="contained" color="primary" style={{ marginLeft: "10px" }}>Upload and Transcribe</Button>
                {loading && <CircularProgress style={{ marginTop: "10px" }} />}
                {transcription && (
                  <div>
                    <h2>Transcription:</h2>
                    <Typography variant="body1">{transcription}</Typography>
                  </div>
                )}
              </div>
              <Box style={{ marginTop: "40px" }}>
                <Typography variant="h4" gutterBottom>
                  Real-time Audio Recording
                </Typography>
                <Recorder />
              </Box>
            </Box>
          } />
          <Route path="/realtime" element={<RealTimeSTT />} />
          <Route path="/table2" element={<Table2Data />} />
          <Route path="/table1/:pact_id" element={<Table1Data />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
