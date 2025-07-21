import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SimpleTest = () => {
  const { testId } = useParams();
  const [status, setStatus] = useState('Initializing...');
  const [data, setData] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setStatus('Loading test parts...');
        console.log('Testing API for testId:', testId);
        
        const response = await axios.get(`http://localhost:8080/api/tests/${testId}/parts`);
        console.log('API Response:', response.data);
        
        setData(response.data);
        setStatus('Success! Data loaded.');
      } catch (error) {
        console.error('API Error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    if (testId) {
      testAPI();
    }
  }, [testId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Simple Test Debug</h2>
      <p><strong>Test ID:</strong> {testId}</p>
      <p><strong>Status:</strong> {status}</p>
      
      {data && (
        <div>
          <h3>Test Parts ({data.length}):</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SimpleTest;
