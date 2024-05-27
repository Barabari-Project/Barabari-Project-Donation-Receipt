import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import encryptData from '../utils/encryptData';
import { CircularProgress, TextField, Button, Box, Typography, CssBaseline, AppBar, Toolbar, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './barabari_logo.png';

const App: React.FC = () => {
  const [starting, setStarting] = useState<number | ''>('');
  const [ending, setEnding] = useState<number | ''>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [ccEmail, setCcEmail] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const awakeServer = async () => {
      try {
        await axios.get(import.meta.env.VITE_BACKEND_ENDPOINT as string);
      } catch (error) {
        toast.error('Internal Server Error | please contact to developers');
      }
    }
    awakeServer();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    console.log(event.target.files?.length);
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const delay = (ms: number) => {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  };

  const handleSubmit = async () => {
    if (starting == '' || ending == '' || starting < 1 || starting > ending) {
      toast.error('Please ensure that the starting and ending rows are valid numbers, the starting row is less than the ending row');
    } else if (password === '') {
      toast.error('please provide valid password');
    } else if (!file) {
      toast.error('please select a file');
    } else if (email === '' || ccEmail === '') {
      toast.error('please provide email and cc email');
    } else {
      try {
        setIsLoading(true);

        await delay(5000);

        // Read the Excel file
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        console.log(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,  // This ensures dates are parsed to JS date objects
          dateNF: 'dd-mm-yyyy',  // Define date format
        });

        const encryptedObj = encryptData({
          startingRowNo: starting,
          endingRowNo: ending,
          email,
          ccEmail,
          password,
          fileData: jsonData // Include the Excel data in the payload
        });

        // console.log(jsonData);
        // Making the Axios call
        // const response = await axios.post(import.meta.env.VITE_BACKEND_ENDPOINT as string, { encryptedData: encryptedObj });

        // // Handle success
        // if (response.status === 200) {
        //   toast.success('Congratulations! The recipes have been sent successfully.');
        // }
        // else {
        //   toast.error('Encounter Error in sending mail please connect to the developer'); // error
        // }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data); // error
        } else {
          toast.error('Internal Server Error'); // error
        }
        // Handle error
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        // backgroundColor: '#cad8e5',
        backgroundColor: '#1976d2'
      }}>
      <ToastContainer />
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: '#333' }}>
        <Toolbar>
          {/* Logo */}
          <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />

          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Raksha x Barabari Donation Receipt Generator
          </Typography>
        </Toolbar>
      </AppBar>

      {!isLoading ?
        <Container maxWidth="sm" sx={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-30px'
        }}>
          <Box
            sx={{
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              backgroundColor: 'white',
              marginTop: '20px',
              boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
            }}
          >
            <Box sx={{ marginTop: '20px' }}>
              <TextField
                label="Email Id"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{ marginBottom: '10px' }}
                InputProps={{ style: { color: '#333' } }} // Dark text color for input field
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ marginBottom: '10px' }}
                InputProps={{ style: { color: '#333' } }} // Dark text color for input field
              />
              <TextField
                label="Cc : Email Id"
                type="email"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                fullWidth
                sx={{ marginBottom: '10px' }}
                InputProps={{ style: { color: '#333' } }} // Dark text color for input field
              />
              <TextField
                label="Starting Row"
                type="number"
                value={starting}
                onChange={(e) => setStarting(parseInt(e.target.value))}
                fullWidth
                sx={{ marginBottom: '10px' }}
                InputProps={{ style: { color: '#333' } }} // Dark text color for input field
              />
              <TextField
                label="Ending Row"
                type="number"
                value={ending}
                onChange={(e) => setEnding(parseInt(e.target.value))}
                fullWidth
                sx={{ marginBottom: '10px' }}
                InputProps={{ style: { color: '#333' } }} // Dark text color for input field
              />
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ marginBottom: '10px', width: '100%', padding: '10px 0' }}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
        : (
          <div style={{ color: 'white' }}>
            <CircularProgress color='inherit' sx={{ marginTop: '20px', position: 'absolute', top: '35%', left: '50%' }} />
          </div>
        )}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          backgroundColor: '#333',
          color: '#fff',
          textAlign: 'center',
          mt: 'auto',
          borderTop: '1px solid #ddd', // Adding a border at the top for separation
        }}
      >
        <Typography variant="body2" sx={{ lineHeight: '1.5' }}>
          © {new Date().getFullYear()} Barabari Collective Developers.
          <br />
          Built By
          <a href="https://github.com/drumil32" target='_blank' color="inherit" style={{ marginLeft: '5px', color: 'yellow' }}>
            Drumil Akhenia.
          </a>
          <br />
          Want us to build something for you?
          <a href="https://www.barabariproject.org/" target='_blank' color="inherit" style={{ marginLeft: '5px', color: 'yellow' }}>
            Contact us
          </a>
        </Typography>
      </Box>

    </Box>
  );
};

export default App;
