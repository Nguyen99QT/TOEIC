import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/auth';

const TestDebug = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const testApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🧪 Testing API call...');
      const response = await axios.get(
        'http://localhost:8080/api/tests/2/part/1/questions',
        {
          headers: getAuthHeaders()
        }
      );
      
      console.log('🧪 API Response:', response.data);
      setQuestions(response.data);
    } catch (err) {
      console.error('🧪 API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Debug Test</h1>
      
      <div className="mb-4">
        <button
          onClick={testApiCall}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Loading...' : 'Test API Call'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Token: {getToken() ? 'Present' : 'Missing'}</p>
        <p>Questions Count: {questions.length}</p>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Questions ({questions.length}):</h2>
          {questions.map((question, index) => (
            <div key={question.questionId} className="bg-white border rounded p-4">
              <h3 className="font-semibold">Question {index + 1} (ID: {question.questionId})</h3>
              <p className="text-gray-700 mb-2">{question.questionText}</p>
              
              {question.imageUrl && (
                <div className="mb-2">
                  <img 
                    src={`http://localhost:8080${question.imageUrl}`} 
                    alt="Question" 
                    className="max-w-xs rounded"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                {question.options && question.options.map(option => (
                  <div key={option.optionId} className="flex items-center space-x-2">
                    <span className="font-medium">{option.label}.</span>
                    <span>{option.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestDebug;
