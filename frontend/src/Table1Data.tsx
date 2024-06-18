// frontend/src/Table1Data.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Paper } from '@mui/material';

interface Table1DataProps {
  pact_id: number;
  present_illness: string;
  medical_history: string;
  symptom1: boolean;
  symptom2: boolean;
  symptom3: boolean;
  symptom4: boolean;
  symptom5: boolean;
  symptom6: boolean;
  symptom7: boolean;
  symptom8: boolean;
  symptom9: boolean;
  symptom10: boolean;
  vital_sign1: number;
  vital_sign2: number;
  vital_sign3: number;
  vital_sign4: number;
  vital_sign5: number;
  vital_sign6: number;
  vital_sign7: number;
  vital_sign8: number;
  vital_sign9: number;
  pain_assessment_pain: string;
  pain_assessment_category: string;
  pain_assessment_age: string;
  pain_assessment_tool: string;
  care_plan: string;
}

const Table1Data: React.FC = () => {
  const { pactId } = useParams<{ pactId: string }>();
  const [data, setData] = useState<Table1DataProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/table1/${pactId}`);
        console.log(response.data); // 데이터를 가져왔는지 확인하기 위해 콘솔에 출력
        if (response.data && response.data.data.length > 0) {
          setData(response.data.data[0]);
        } else {
          setData(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching table1 data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pactId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!data) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>No data found for pact_id: {pactId}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Table1 Data for pact_id: {pactId}</Typography>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5">Present illness</Typography>
        <Typography variant="body1">{data.present_illness}</Typography>
        
        <Typography variant="h5" style={{ marginTop: 20 }}>Past medical history</Typography>
        <Typography variant="body1">{data.medical_history}</Typography>

        <Typography variant="h5" style={{ marginTop: 20 }}>Review of system</Typography>
        <Typography variant="body1">Mental status: {data.symptom1 ? "Normal" : "Not Normal"}</Typography>
        <Typography variant="body1">General condition: {data.symptom2 ? "Normal" : "Not Normal"}</Typography>

        <Typography variant="h5" style={{ marginTop: 20 }}>Vital sign</Typography>
        <Typography variant="body1">Vital sign 1: {data.vital_sign1}</Typography>
        <Typography variant="body1">Vital sign 2: {data.vital_sign2}</Typography>

        <Typography variant="h5" style={{ marginTop: 20 }}>Pain assessment</Typography>
        <Typography variant="body1">Pain: {data.pain_assessment_pain}</Typography>
        <Typography variant="body1">Category: {data.pain_assessment_category}</Typography>
        <Typography variant="body1">Age: {data.pain_assessment_age}</Typography>
        <Typography variant="body1">Tool: {data.pain_assessment_tool}</Typography>

        <Typography variant="h5" style={{ marginTop: 20 }}>Care plan</Typography>
        <Typography variant="body1">{data.care_plan}</Typography>
      </Paper>
    </Container>
  );
};

export default Table1Data;