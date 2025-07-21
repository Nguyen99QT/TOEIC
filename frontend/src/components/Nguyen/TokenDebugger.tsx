import React, { useState, useEffect } from 'react';

interface TestResult {
  status?: number;
  ok?: boolean;
  statusText?: string;
}

interface TestResults {
  [endpoint: string]: TestResult | string;
}

interface TokenInfo {
  token: string | null;
  authToken: string | null;
  accessToken: string | null;
  jwtToken: string | null;
}

const TokenDebugger = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    token: null,
    authToken: null,
    accessToken: null,
    jwtToken: null
  });
  const [testResults, setTestResults] = useState<TestResults>({});

  useEffect(() => {
    // Check all possible token keys
    const tokens = {
      token: localStorage.getItem('token'),
      authToken: localStorage.getItem('authToken'),
      accessToken: localStorage.getItem('accessToken'),
      jwtToken: localStorage.getItem('jwtToken')
    };

    setTokenInfo(tokens);
  }, []);

  const testEndpoint = async (endpoint: string) => {
    const token = localStorage.getItem('token') || 
                 localStorage.getItem('authToken') || 
                 localStorage.getItem('accessToken');

    if (!token) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        [endpoint]: 'No token found'
      }));
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      setTestResults((prev: TestResults) => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          data: responseData
        }
      }));
    } catch (error) {
      setTestResults((prev: TestResults) => ({
        ...prev,
        [endpoint]: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  const clearAllTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('jwtToken');
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Token & API Debugger</h1>
      
      {/* Token Information */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Tokens in localStorage:</h2>
        <div className="space-y-2">
          {Object.entries(tokenInfo).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="font-medium w-24">{key}:</span>
              <span className="text-sm text-gray-600 break-all">
                {value ? `${String(value).substring(0, 50)}...` : 'null'}
              </span>
            </div>
          ))}
        </div>
        <button 
          onClick={clearAllTokens}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear All Tokens
        </button>
      </div>

      {/* API Tests */}
      <div className="mb-6 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-3">API Endpoint Tests:</h2>
        <div className="space-y-2">
          <button 
            onClick={() => testEndpoint('/api/auth/test')}
            className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Auth
          </button>
          <button 
            onClick={() => testEndpoint('/api/auth/verify')}
            className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Verify
          </button>
          <button 
            onClick={() => testEndpoint('/api/question-group')}
            className="mr-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Test Question Groups
          </button>
          <button 
            onClick={() => testEndpoint('/api/question-bank/my')}
            className="mr-2 px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Test My Questions
          </button>
          <button 
            onClick={() => testEndpoint('/api/question-group/my')}
            className="mr-2 px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Test My Groups
          </button>
          <button 
            onClick={() => testEndpoint('/api/question-group/all')}
            className="mr-2 px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Test All Groups
          </button>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <div className="space-y-2">
            {Object.entries(testResults).map(([endpoint, result]) => (
              <div key={endpoint} className="flex">
                <span className="font-medium w-48">{endpoint}:</span>
                <span className="text-sm">
                  {typeof result === 'object' ? JSON.stringify(result) : String(result)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Login */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Quick Actions:</h2>
        <div className="space-x-2">
          <a 
            href="/login" 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Go to Login
          </a>
          <a 
            href="/questions/simple" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simple Questions Page
          </a>
          <a 
            href="/add/modern-questions" 
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Modern Add Question
          </a>
          <a 
            href="/questions/my" 
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            My Questions Page
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenDebugger;
