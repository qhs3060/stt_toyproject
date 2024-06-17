// frontend/src/Table2Data.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Typography, 
  TablePagination 
} from '@mui/material';

interface Table2Data {
  pact_id: number;
  patient_name: string;
  patient_number: number;
  datetime: string;
  gender: string;
  age: number;
  department: string;
}

const Table2Data: React.FC = () => {
  const [data, setData] = useState<Table2Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchData = async (page: number, rowsPerPage: number) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/table2/', {
        params: {
          page: page + 1,  // 서버의 페이지는 1부터 시작하지만, React의 페이지는 0부터 시작하므로 +1 합니다.
          limit: rowsPerPage
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching table2 data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (pact_id: number) => {
    navigate(`/table1/${pact_id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Table2 Data
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pact ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Patient Number</TableCell>
                <TableCell>DateTime</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Department</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow 
                  key={row.pact_id} 
                  hover 
                  onClick={() => handleRowClick(row.pact_id)} 
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{row.pact_id}</TableCell>
                  <TableCell>{row.patient_name}</TableCell>
                  <TableCell>{row.patient_number}</TableCell>
                  <TableCell>{new Date(row.datetime).toLocaleString()}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={-1}  // 총 항목 수를 모를 때는 -1로 설정할 수 있습니다.
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default Table2Data;