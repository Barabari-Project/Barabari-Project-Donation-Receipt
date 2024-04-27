import React, { useState } from 'react';
import axios from 'axios';
import encryptData from '../utils/encryptData';
import { CircularProgress } from "@mui/material";

const App: React.FC = () => {
  const [starting, setStarting] = useState<number | ''>('');
  const [ending, setEnding] = useState<number | ''>('');
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (starting !== '' && ending !== '' && starting > 1 && starting <= ending && text.trim() !== '') {
      try {
        setIsLoading(true);
        const encryptedObj = encryptData({
          startingRowNo: starting,
          endingRowNo: ending,
          password: text
        });
        // Making the Axios call
        const response = await axios.post(import.meta.env.VITE_BACKEND_ENDPOINT as string, { encryptedData: encryptedObj });
        // Handle success
        console.log('Response:', response);
        alert('mail was successfully sent');
      } catch (error) {
        alert('internal Server Error');
        // Handle error
        console.error('Error:', error);
      }finally{
        setIsLoading(false);
      }
    } else {
      alert('Please make sure starting and ending are valid numbers and starting is smaller than ending, and text field is not empty.');
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
            Text:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
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
