import React, { useState } from 'react';

const TestAddQuestion = () => {
  const [result, setResult] = useState('');

  const testSubmit = async () => {
    try {
      // Get fresh token
      const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'teacher2', password: 'password123' })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (!loginData.success) {
        setResult('Login failed: ' + loginData.message);
        return;
      }

      const token = loginData.token;
      console.log('Token:', token);

      // Create form data
      const formData = new FormData();
      
      const questionObj = {
        partNumber: 1,
        questionText: "Test question from React",
        correctOptionLabel: "A",
        options: [
          { label: "A", content: "Option A" },
          { label: "B", content: "Option B" },
          { label: "C", content: "Option C" },
          { label: "D", content: "Option D" }
        ]
      };

      formData.append('question', new Blob([JSON.stringify(questionObj)], {
        type: 'application/json'
      }));

      console.log('Sending request with token:', token.substring(0, 50) + '...');

      const response = await fetch('http://localhost:8080/api/question-bank/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseData = await response.text();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);
      
      setResult(`Status: ${response.status}, Response: ${responseData}`);

    } catch (error) {
      console.error('Error:', error);
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Add Question</h2>
      <button onClick={testSubmit}>Test Submit</button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {result}
      </div>
    </div>
  );
};

export default TestAddQuestion;
