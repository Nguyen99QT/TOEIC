import React, { useState } from 'react';
import { getToken } from '../../services/auth';

interface TestResult {
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: string;
}

interface Question {
  questionId: number;
  questionText: string;
  options: Array<{
    label: string;
    content: string;
  }>;
  correctOptionLabel: string;
  partNumber: number;
}

const TestIndividualQuestions: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addResult = (type: TestResult['type'], message: string) => {
    const newResult: TestResult = {
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [...prev, newResult]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Test 1: Fetch All Individual Questions
  const testFetchQuestions = async () => {
    setLoading(true);
    addResult('info', '🔍 Testing: Fetch all individual questions...');
    
    try {
      const token = getToken();
      if (!token) {
        addResult('error', '❌ No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:8080/api/question-bank/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      addResult('info', `📡 Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        addResult('success', `✅ Success! Found ${data.length} questions`);
        
        if (data.length > 0) {
          addResult('info', `📊 First question:\n- ID: ${data[0]?.questionId}\n- Text: ${data[0]?.questionText?.substring(0, 100)}...`);
          setSelectedQuestionId(data[0]?.questionId?.toString() || '');
        }
      } else {
        const errorText = await response.text();
        addResult('error', `❌ Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      addResult('error', `🔥 Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Fetch Single Question
  const testFetchSingleQuestion = async () => {
    if (!selectedQuestionId) {
      addResult('warning', '⚠️ Please select a question ID first');
      return;
    }

    setLoading(true);
    addResult('info', `🔍 Testing: Fetch single question (ID: ${selectedQuestionId})...`);

    try {
      const token = getToken();
      if (!token) {
        addResult('error', '❌ No authentication token found');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/question-bank/${selectedQuestionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      addResult('info', `📡 Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        addResult('success', `✅ Question fetched successfully!`);
        addResult('info', `📊 Question details:\n- ID: ${data.questionId}\n- Text: ${data.questionText}\n- Options: ${data.options?.length || 0}\n- Correct: ${data.correctOptionLabel}`);
      } else {
        const errorText = await response.text();
        addResult('error', `❌ Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      addResult('error', `🔥 Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Test Update Question (without actually updating)
  const testUpdateQuestionValidation = async () => {
    if (!selectedQuestionId) {
      addResult('warning', '⚠️ Please select a question ID first');
      return;
    }

    addResult('info', `🔍 Testing: Update question validation (ID: ${selectedQuestionId})...`);
    addResult('info', '📝 Creating test form data...');

    try {
      const token = getToken();
      if (!token) {
        addResult('error', '❌ No authentication token found');
        return;
      }

      // Create test form data
      const formData = new FormData();
      const questionDTO = {
        questionText: 'Test question update',
        partNumber: 1,
        correctOptionLabel: 'A',
        options: [
          { label: 'A', content: 'Option A' },
          { label: 'B', content: 'Option B' },
          { label: 'C', content: 'Option C' },
          { label: 'D', content: 'Option D' }
        ]
      };

      formData.append('question', new Blob([JSON.stringify(questionDTO)], { type: 'application/json' }));

      addResult('success', '✅ Form data prepared successfully');
      addResult('info', `📋 Test data:\n- Question: ${questionDTO.questionText}\n- Options: ${questionDTO.options.length}\n- Correct: ${questionDTO.correctOptionLabel}`);
      addResult('warning', '⚠️ This is a validation test only - no actual update sent');

    } catch (error) {
      addResult('error', `🔥 Preparation error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  // Test 5: Test Delete Question (simulation only)
  const testDeleteQuestionSimulation = async () => {
    if (!selectedQuestionId) {
      addResult('warning', '⚠️ Please select a question ID first');
      return;
    }

    addResult('info', `🗑️ Testing: Delete question simulation (ID: ${selectedQuestionId})...`);

    try {
      const token = getToken();
      if (!token) {
        addResult('error', '❌ No authentication token found');
        return;
      }

      addResult('warning', '⚠️ This is a SIMULATION - no actual deletion will occur');
      addResult('info', `🔍 Would send DELETE request to: /api/question-bank/${selectedQuestionId}`);
      addResult('info', `🔑 Using token: ${token.substring(0, 20)}...`);
      addResult('success', '✅ Delete simulation completed - question would be removed');

    } catch (error) {
      addResult('error', `🔥 Simulation error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  // Test 6: Test Real Update Question
  const testRealUpdateQuestion = async () => {
    if (!selectedQuestionId) {
      addResult('warning', '⚠️ Please select a question ID first');
      return;
    }

    if (!window.confirm('⚠️ This will ACTUALLY update the question! Are you sure?')) {
      addResult('info', '❌ User cancelled real update test');
      return;
    }

    setLoading(true);
    addResult('info', `📝 Testing: REAL update question (ID: ${selectedQuestionId})...`);

    try {
      const token = getToken();
      if (!token) {
        addResult('error', '❌ No authentication token found');
        return;
      }

      // First fetch current question
      const fetchResponse = await fetch(`http://localhost:8080/api/question-bank/${selectedQuestionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!fetchResponse.ok) {
        addResult('error', `❌ Could not fetch current question: ${fetchResponse.status}`);
        return;
      }

      const currentQuestion = await fetchResponse.json();
      addResult('info', '✅ Current question fetched successfully');

      // Create updated form data (minimal change to avoid breaking the question)
      const formData = new FormData();
      const questionDTO = {
        questionText: currentQuestion.questionText + ' [TESTED]',
        partNumber: currentQuestion.partNumber,
        correctOptionLabel: currentQuestion.correctOptionLabel,
        options: currentQuestion.options
      };

      formData.append('question', new Blob([JSON.stringify(questionDTO)], { type: 'application/json' }));

      addResult('info', '📝 Sending UPDATE request...');
      const updateResponse = await fetch(`http://localhost:8080/api/question-bank/${selectedQuestionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      addResult('info', `📡 Update response status: ${updateResponse.status}`);

      if (updateResponse.ok) {
        addResult('success', '✅ REAL UPDATE SUCCESSFUL!');
        addResult('info', '🔄 Question has been updated with [TESTED] marker');
        // Refresh questions list
        testFetchQuestions();
      } else {
        const errorText = await updateResponse.text();
        addResult('error', `❌ Update failed: ${errorText}`);
      }

    } catch (error) {
      addResult('error', `🔥 Real update error: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 7: Run All Tests
  const runAllTests = async () => {
    addResult('info', '🚀 Running complete test suite...');
    
    await testAuthentication();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testFetchQuestions();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (selectedQuestionId) {
      await testFetchSingleQuestion();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testUpdateQuestionValidation();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await testDeleteQuestionSimulation();
    }
    
    addResult('success', '🎉 Complete test suite finished!');
  };
  const testAuthentication = async () => {
    addResult('info', '🔍 Testing: Authentication status...');

    try {
      const token = getToken();
      
      if (!token) {
        addResult('error', '❌ No token found - user not authenticated');
        return;
      }

      addResult('success', '✅ Token found in storage');
      addResult('info', `� Token preview: ${token.substring(0, 20)}...`);

      // Test token validity with a simple request
      const response = await fetch('http://localhost:8080/api/question-bank/my', {
        method: 'HEAD', // Just check headers, no body
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        addResult('success', '✅ Token is valid - authentication working');
      } else {
        addResult('error', `❌ Token validation failed - status: ${response.status}`);
      }

    } catch (error) {
      addResult('error', `🔥 Authentication test error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const getResultIcon = (type: TestResult['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getResultColor = (type: TestResult['type']) => {
    switch (type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      default: return '#17a2b8';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '20px auto' }}>
      <div style={{ border: '2px solid #007bff', borderRadius: '8px', padding: '20px', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ color: '#007bff', marginBottom: '20px' }}>🧪 Individual Questions API Testing Suite</h2>
        
        {/* Control Panel */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #dee2e6' }}>
          <h4 style={{ marginBottom: '15px', color: '#495057' }}>Test Controls</h4>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
            <button 
              onClick={testAuthentication} 
              disabled={loading}
              style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🔑 Test Auth
            </button>
            
            <button 
              onClick={testFetchQuestions} 
              disabled={loading}
              style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              📋 Fetch All
            </button>
            
            <button 
              onClick={testFetchSingleQuestion} 
              disabled={loading || !selectedQuestionId}
              style={{ padding: '8px 16px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🔍 Fetch Single
            </button>
            
            <button 
              onClick={testUpdateQuestionValidation} 
              disabled={loading || !selectedQuestionId}
              style={{ padding: '8px 16px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              📝 Test Update
            </button>

            <button 
              onClick={testDeleteQuestionSimulation} 
              disabled={loading || !selectedQuestionId}
              style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🗑️ Test Delete
            </button>

            <button 
              onClick={testRealUpdateQuestion} 
              disabled={loading || !selectedQuestionId}
              style={{ padding: '8px 16px', backgroundColor: '#e83e8c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              ⚠️ Real Update
            </button>

            <button 
              onClick={runAllTests} 
              disabled={loading}
              style={{ padding: '8px 16px', backgroundColor: '#20c997', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🚀 Run All
            </button>
            
            <button 
              onClick={clearResults}
              style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              🗑️ Clear
            </button>
          </div>

          {/* Question Selection */}
          {questions.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <label htmlFor="questionSelect" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Select Question for Single Tests:
              </label>
              <select 
                id="questionSelect"
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ced4da', minWidth: '300px' }}
              >
                <option value="">Choose a question...</option>
                {questions.map((q, index) => (
                  <option key={q.questionId} value={q.questionId}>
                    ID: {q.questionId} - {q.questionText?.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Status */}
        {loading && (
          <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', marginBottom: '20px' }}>
            <strong>🔄 Testing in progress...</strong>
          </div>
        )}

        {/* Results */}
        <div style={{ backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '5px', padding: '15px' }}>
          <h4 style={{ marginBottom: '15px', color: '#495057' }}>Test Results ({results.length})</h4>
          
          {results.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No tests run yet. Click a test button to start.</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {results.map((result, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '10px', 
                    marginBottom: '8px', 
                    backgroundColor: '#f8f9fa', 
                    borderLeft: `4px solid ${getResultColor(result.type)}`,
                    borderRadius: '0 4px 4px 0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ color: getResultColor(result.type), fontWeight: 'bold' }}>
                      {getResultIcon(result.type)}
                    </span>
                    <small style={{ color: '#6c757d' }}>{result.timestamp}</small>
                  </div>
                  <pre style={{ 
                    margin: '5px 0 0 0', 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '14px',
                    color: '#495057'
                  }}>
                    {result.message}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {questions.length > 0 && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', border: '1px solid #b8daff', borderRadius: '5px' }}>
            <h5 style={{ color: '#004085', marginBottom: '10px' }}>📊 Quick Stats</h5>
            <p style={{ margin: 0, color: '#004085' }}>
              Total Questions: <strong>{questions.length}</strong> | 
              Selected: <strong>{selectedQuestionId || 'None'}</strong> |
              Tests Run: <strong>{results.length}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestIndividualQuestions;
