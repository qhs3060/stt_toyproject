import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Button,
  Grid,
} from '@mui/material';

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
        if (response.data && response.data.data.length > 0) {
          setData(response.data.data[0]);
        } else {
          setData(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching table1 data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pactId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (data) {
      setData({ ...data, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (data) {
      setData({ ...data, [name]: checked });
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (data) {
      setData({ ...data, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:8000/table1/${pactId}`, data);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!data) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          No data found for pact_id: {pactId}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Table1 Data for pact_id: {pactId}
      </Typography>
      <Paper style={{ padding: 20 }}>
        <Typography variant="h5">Present illness</Typography>
        <TextField
          fullWidth
          variant="outlined"
          name="present_illness"
          value={data.present_illness}
          onChange={handleInputChange}
        />

        <Typography variant="h5" style={{ marginTop: 20 }}>
          Past medical history
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          name="medical_history"
          value={data.medical_history}
          onChange={handleInputChange}
        />
        
        <Typography variant="h5" style={{ marginTop: 20 }}>
          Review of system
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormGroup>
              <Typography variant="body1">Mental status</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom1}
                    onChange={handleCheckboxChange}
                    name="symptom1"
                  />
                }
                label="Normal"
              />
              <Typography variant="body1">Respiratory</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom2}
                    onChange={handleCheckboxChange}
                    name="symptom2"
                  />
                }
                label="Normal"
              />
              <Typography variant="body1">General</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom3}
                    onChange={handleCheckboxChange}
                    name="symptom3"
                  />
                }
                label="Normal"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={4}>
            <FormGroup>
              <Typography variant="body1">General condition</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom4}
                    onChange={handleCheckboxChange}
                    name="symptom4"
                  />
                }
                label="Normal"
              />
              <Typography variant="body1">Gastrointestinal</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom5}
                    onChange={handleCheckboxChange}
                    name="symptom5"
                  />
                }
                label="Normal"
              />
              <Typography variant="body1">Head & Neck</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom6}
                    onChange={handleCheckboxChange}
                    name="symptom6"
                  />
                }
                label="Normal"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={4}>
            <FormGroup>
              <Typography variant="body1">Urinary</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom8}
                    onChange={handleCheckboxChange}
                    name="symptom8"
                  />
                }
                label="Normal"
              />
              <Typography variant="body1">Cardiovascular</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom9}
                    onChange={handleCheckboxChange}
                    name="symptom9"
                  />
                }
                label="Normal"
              />
              <Typography variant="body1">Musculoskeletal</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.symptom10}
                    onChange={handleCheckboxChange}
                    name="symptom10"
                  />
                }
                label="Normal"
              />
            </FormGroup>
          </Grid>
        </Grid>

        <Typography variant="h5" style={{ marginTop: 20 }}>
          Vital sign
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign1"
              value={data.vital_sign1}
              onChange={handleInputChange}
              label="Height (cm)"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign2"
              value={data.vital_sign2}
              onChange={handleInputChange}
              label="Weight (kg)"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign3"
              value={data.vital_sign3}
              onChange={handleInputChange}
              label="BMI"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign4"
              value={data.vital_sign4}
              onChange={handleInputChange}
              label="SBP (mmHg)"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign5"
              value={data.vital_sign5}
              onChange={handleInputChange}
              label="DBP (mmHg)"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign6"
              value={data.vital_sign6}
              onChange={handleInputChange}
              label="BST"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign7"
              value={data.vital_sign7}
              onChange={handleInputChange}
              label="BT (°C)"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign8"
              value={data.vital_sign8}
              onChange={handleInputChange}
              label="RR (/min)"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              variant="outlined"
              name="vital_sign9"
              value={data.vital_sign9}
              onChange={handleInputChange}
              label="HR (/min)"
            />
          </Grid>
        </Grid>

        <Typography variant="h5" style={{ marginTop: 20 }}>
          Pain assessment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Pain</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_pain === 'Yes'} onChange={handleCheckboxChange} name="pain_assessment_pain" value="Yes" />}
                  label="Yes"
                />
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_pain === 'No'} onChange={handleCheckboxChange} name="pain_assessment_pain" value="No" />}
                  label="No"
                />
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_pain === 'Unknown'} onChange={handleCheckboxChange} name="pain_assessment_pain" value="Unknown" />}
                  label="Unknown"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Category</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_category === 'General'} onChange={handleCheckboxChange} name="pain_assessment_category" value="General" />}
                  label="General"
                />
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_category === 'Critical'} onChange={handleCheckboxChange} name="pain_assessment_category" value="Critical" />}
                  label="Critical"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Age</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_age === 'Newborn'} onChange={handleCheckboxChange} name="pain_assessment_age" value="Newborn" />}
                  label="Newborn"
                />
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_age === '0-6 years'} onChange={handleCheckboxChange} name="pain_assessment_age" value="0-6 years" />}
                  label="0-6 years"
                />
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_age === '13+ years'} onChange={handleCheckboxChange} name="pain_assessment_age" value="13+ years" />}
                  label="13+ years"
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tool</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_tool === 'Tool1'} onChange={handleCheckboxChange} name="pain_assessment_tool" value="Tool1" />}
                  label="Tool1"
                />
                <FormControlLabel
                  control={<Checkbox checked={data.pain_assessment_tool === 'Tool2'} onChange={handleCheckboxChange} name="pain_assessment_tool" value="Tool2" />}
                  label="Tool2"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h5" style={{ marginTop: 20 }}>
          Care plan
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          name="care_plan"
          value={data.care_plan}
          onChange={handleInputChange}
        />

        <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: 20 }}>
          Save
        </Button>
      </Paper>
    </Container>
  );
};

export default Table1Data;
