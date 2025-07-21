import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DebugTOEIC = () => {
  const { testId } = useParams();
  const [status, setStatus] = useState('Initializing...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setStatus('Testing APIs...');
        console.log('Testing API for testId:', testId);
        
        // Test 1: Get test parts
        setStatus('Testing parts API...');
        const partsResponse = await axios.get(`http://localhost:8080/api/tests/${testId}/parts`);
        console.log('Parts API Response:', partsResponse.data);
        
        // Test 2: Get questions for part 1
        setStatus('Testing questions API...');
        const questionsResponse = await axios.get(`http://localhost:8080/api/tests/${testId}/part/1/questions`);
        console.log('Questions API Response:', questionsResponse.data);
        
        setData({
          parts: partsResponse.data,
          questions: questionsResponse.data.slice(0, 2) // Only show first 2 questions
        });
        setStatus('✅ All APIs working!');
      } catch (error) {
        console.error('API Error:', error);
        setError(error.message);
        setStatus('❌ Error occurred');
      }
    };

    if (testId) {
      testAPI();
    }
  }, [testId]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔍 TOEIC Test Debug</h2>
      <p><strong>Test ID:</strong> {testId}</p>
      <p><strong>Status:</strong> {status}</p>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          border: '1px solid #fcc', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div>
          <h3>✅ Test Parts ({data.parts.length}):</h3>
          <ul>
            {data.parts.map(part => (
              <li key={part.partId}>
                <strong>Part {part.partNumber}:</strong> {part.title}
              </li>
            ))}
          </ul>
          
          <h3>✅ Sample Questions ({data.questions.length}):</h3>
          {data.questions.map((question, index) => (
            <div key={question.questionId} style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px'
            }}>
              <p><strong>Q{index + 1}:</strong> {question.questionText}</p>
              {question.audioUrl && (
                <p><strong>Audio:</strong> {question.audioUrl}</p>
              )}
              {question.imageUrl && (
                <p><strong>Image:</strong> {question.imageUrl}</p>
              )}
              <div>
                <strong>Options:</strong>
                <ul>
                  {question.options.map(option => (
                    <li key={option.optionId}>
                      {option.label}. {option.content}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
          <div style={{
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            padding: '15px',
            borderRadius: '5px',
            marginTop: '20px'
          }}>
            <h3>🎯 Ready to implement TOEIC Test!</h3>
            <p>All APIs are working correctly. You can now:</p>
            <ul>
              <li>✅ Load test parts</li>
              <li>✅ Load questions for each part</li>
              <li>✅ Display questions with options</li>
              <li>✅ Show audio and image URLs</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugTOEIC;
