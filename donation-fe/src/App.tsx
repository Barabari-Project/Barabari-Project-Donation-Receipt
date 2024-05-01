import React, { useState } from 'react';
import axios from 'axios';
import encryptData from '../utils/encryptData';
import { CircularProgress, TextField, Button, Box, Typography, CssBaseline, AppBar, Toolbar, Container } from '@mui/material';


const App: React.FC = () => {
  const [starting, setStarting] = useState<number | ''>('');
  console.log(starting);
  const [ending, setEnding] = useState<number | ''>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (starting !== '' && ending !== '' && starting > 1 && starting <= ending && password.trim() !== '') {
      try {
        setIsLoading(true);
        const encryptedObj = encryptData({
          startingRowNo: starting,
          endingRowNo: ending,
          password: password
        });
        // Making the Axios call
        const response = await axios.post(import.meta.env.VITE_BACKEND_ENDPOINT as string, { encryptedData: encryptedObj });

        // Handle success
        if (response.status === 200)
          alert('Congratulations! The recipes have been sent successfully.');
        else {
          alert('Encounter Error in sending mail please connect to the developer');
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          alert(error.response.data);
        } else {
          alert('Internal Server Error');
        }
        // Handle error
        console.error('Error:', error);
        // console.error(error!.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please make sure starting and ending are valid numbers and starting is smaller than ending, and password field is not empty.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#cad8e5',
      }}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: '#333' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center', width: '100%' }}>
            Barabari Recipe Generator
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
                label="Starting Row"
                type="number"
                value={starting}
                onChange={(e) => !Number.isNaN(parseInt(e.target.value)) && setStarting(parseInt(e.target.value))}
                fullWidth
                sx={{ marginBottom: '10px' }}
                InputProps={{ style: { color: '#333' } }} // Dark text color for input field
              />
              <TextField
                label="Ending Row"
                type="number"
                value={ending}
                onChange={(e) => !Number.isNaN(parseInt(e.target.value)) && setEnding(parseInt(e.target.value))}
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
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
        : (
          <CircularProgress sx={{ marginTop: '20px', position: 'absolute', top: '50%', left: '50%' }} />
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
          © {new Date().getFullYear()} Built by Barabari Developer.
          <br />
          Want to build something for you?
          <a href="#" color="inherit" style={{ marginLeft: '5px' }}>
            Contact us
          </a>
        </Typography>
      </Box>

    </Box>
  );
};

export default App;
