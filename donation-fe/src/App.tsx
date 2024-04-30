import React, { useState } from 'react';
import axios from 'axios';
import encryptData from '../utils/encryptData';
import { CircularProgress, TextField, Button, Box, Typography, CssBaseline } from '@mui/material';


const App: React.FC = () => {
  const [starting, setStarting] = useState<number | ''>('');
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
          alert('mail was successfully sent');
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
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: '#cad8e5', // Light shade of blue
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#333' }}> {/* Dark text color */}
          Mail Sender
        </Typography>
        {!isLoading ? (
          <Box sx={{ marginTop: '20px' }}>
            <TextField
              label="Starting"
              type="number"
              value={starting}
              onChange={(e) => setStarting(parseInt(e.target.value))}
              fullWidth
              sx={{ marginBottom: '10px' }}
              InputProps={{ style: { color: '#333' } }} // Dark text color for input field
            />
            <TextField
              label="Ending"
              type="number"
              value={ending}
              onChange={(e) => setEnding(parseInt(e.target.value))}
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
        ) : (
          <CircularProgress sx={{ marginTop: '20px' }} />
        )}
      </Box>
    </>
  );
};

export default App;
