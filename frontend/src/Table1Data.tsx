// frontend/src/Table1Data.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Typography 
} from '@mui/material';

interface Table1Data {
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
  const { pact_id } = useParams<{ pact_id: string }>();
  const [data, setData] = useState<Table1Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/table1/${pact_id}`);
        setData(response.data.data[0]);  // 단일 행만 가져오므로 첫 번째 요소만 설정
      } catch (error) {
        console.error("Error fetching table1 data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pact_id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!data) {
    return <Typography variant="h6">No data found for pact_id: {pact_id}</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Table1 Data for pact_id: {pact_id}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Field</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{String(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Table1Data;