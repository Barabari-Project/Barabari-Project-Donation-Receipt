import React, { useState } from 'react';
import axios from 'axios';
import encryptData from '../utils/encryptData';
import { CircularProgress } from "@mui/material";

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
        if( response.status ===200)
          alert('mail was successfully sent');
        else{
          alert('Encounter Error in sending mail please connect to the developer');
        }
      } catch (error) {
        alert('internal Server Error');
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
      {!isLoading ?
        <div>
          <label>
            Starting:
            <input
              type="number"
              value={starting}
              onChange={(e) => setStarting(parseInt(e.target.value))}
            />
          </label>
          <br />
          <label>
            Ending:
            <input
              type="number"
              value={ending}
              onChange={(e) => setEnding(parseInt(e.target.value))}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleSubmit}>Submit</button>
        </div> :
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%'
        }}>
          <CircularProgress />
        </div>
      }
    </>
  );
};

export default App;
