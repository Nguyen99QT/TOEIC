import React, { useState } from 'react';

const APIDebugComponent: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint: string, requireAuth: boolean = false) => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requireAuth) {
        const token = localStorage.getItem('toeic_access_token') || 
                     localStorage.getItem('authToken') || 
                     localStorage.getItem('accessToken');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`http://localhost:8080/api${endpoint}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setResult(`✅ ${endpoint}: ${Array.isArray(data) ? `${data.length} items` : 'Success'}\n${JSON.stringify(data.slice ? data.slice(0, 2) : data, null, 2)}`);
      } else {
        setResult(`❌ ${endpoint}: HTTP ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'teacher',
          password: 'password123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('toeic_access_token', data.token);
        localStorage.setItem('toeic_current_user', JSON.stringify(data.user || data));
        setResult(`✅ Login successful! Token stored.\nUser: ${JSON.stringify(data.user || data, null, 2)}`);
      } else {
        const errorData = await response.text();
        setResult(`❌ Login failed: HTTP ${response.status}\n${errorData}`);
      }
    } catch (error) {
      setResult(`❌ Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔧 API Debug Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => testAPI('/lessons/public/all')}
          disabled={loading}
          style={{ margin: '5px', padding: '10px' }}
        >
          Test Public Lessons
        </button>
        
        <button 
          onClick={testLogin}
          disabled={loading}
          style={{ margin: '5px', padding: '10px' }}
        >
          Test Login
        </button>
        
        <button 
          onClick={() => testAPI('/lessons', true)}
          disabled={loading}
          style={{ margin: '5px', padding: '10px' }}
        >
          Test Auth Lessons
        </button>
        
        <button 
          onClick={() => testAPI('/exercises', true)}
          disabled={loading}
          style={{ margin: '5px', padding: '10px' }}
        >
          Test Exercises
        </button>
        
        <button 
          onClick={() => {
            localStorage.clear();
            setResult('🗑️ LocalStorage cleared');
          }}
          style={{ margin: '5px', padding: '10px' }}
        >
          Clear Storage
        </button>
      </div>

      {loading && <div>⏳ Loading...</div>}
      
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        minHeight: '200px'
      }}>
        {result || 'Click a button to test API endpoints...'}
      </pre>
    </div>
  );
};

export default APIDebugComponent;
