import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AudioDiagnostic = ({ testId, partNumber }) => {
  const [audioList, setAudioList] = useState([]);
  const [diagnosticResults, setDiagnosticResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadAudioList = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/tests/${testId}/part/${partNumber}/questions`);
        const questions = response.data.filter(q => q.audioUrl);
        const audioUrls = questions.map(q => ({
          questionId: q.questionId,
          audioUrl: q.audioUrl,
          fullUrl: `http://localhost:8080${q.audioUrl}`
        }));
        setAudioList(audioUrls);
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    if (testId && partNumber) {
      loadAudioList();
    }
  }, [testId, partNumber]);

  const runDiagnostic = async () => {
    setIsRunning(true);
    const results = {};

    for (const audio of audioList) {
      try {
        console.log(`Testing audio: ${audio.fullUrl}`);
        
        // Test HTTP accessibility
        const headResponse = await fetch(audio.fullUrl, { method: 'HEAD' });
        const contentLength = headResponse.headers.get('content-length');
        const contentType = headResponse.headers.get('content-type');
        
        // Test actual audio loading
        const testAudio = new Audio();
        
        const loadPromise = new Promise((resolve, reject) => {
          testAudio.oncanplaythrough = () => resolve('can-play');
          testAudio.onerror = (e) => reject(e.target.error);
          testAudio.onabort = () => reject(new Error('Load aborted'));
          
          // Timeout after 5 seconds
          setTimeout(() => reject(new Error('Load timeout')), 5000);
        });
        
        testAudio.src = audio.fullUrl;
        
        try {
          await loadPromise;
          results[audio.questionId] = {
            status: 'success',
            contentLength: contentLength,
            contentType: contentType,
            httpStatus: headResponse.status,
            audioUrl: audio.audioUrl
          };
        } catch (audioError) {
          results[audio.questionId] = {
            status: 'audio-error',
            error: audioError.message || 'Unknown audio error',
            contentLength: contentLength,
            contentType: contentType,
            httpStatus: headResponse.status,
            audioUrl: audio.audioUrl
          };
        }
        
      } catch (httpError) {
        results[audio.questionId] = {
          status: 'http-error',
          error: httpError.message || 'HTTP request failed',
          audioUrl: audio.audioUrl
        };
      }
    }

    setDiagnosticResults(results);
    setIsRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'audio-error': return '#f59e0b';
      case 'http-error': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', margin: '20px 0' }}>
      <h3>Audio Diagnostic Tool - Part {partNumber}</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runDiagnostic}
          disabled={isRunning || audioList.length === 0}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? 'Running Diagnostic...' : `Test ${audioList.length} Audio Files`}
        </button>
      </div>

      {Object.keys(diagnosticResults).length > 0 && (
        <div>
          <h4>Results:</h4>
          {Object.entries(diagnosticResults).map(([questionId, result]) => (
            <div 
              key={questionId}
              style={{
                padding: '10px',
                margin: '5px 0',
                border: '1px solid #e5e5e5',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Question {questionId}</strong></span>
                <span 
                  style={{ 
                    color: getStatusColor(result.status),
                    fontWeight: 'bold'
                  }}
                >
                  {result.status.toUpperCase()}
                </span>
              </div>
              
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                <div>URL: {result.audioUrl}</div>
                {result.contentLength && <div>Size: {result.contentLength} bytes</div>}
                {result.contentType && <div>Type: {result.contentType}</div>}
                {result.httpStatus && <div>HTTP Status: {result.httpStatus}</div>}
                {result.error && <div style={{ color: '#dc2626' }}>Error: {result.error}</div>}
              </div>
            </div>
          ))}
          
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            <strong>Summary:</strong>
            <div>
              ✅ Success: {Object.values(diagnosticResults).filter(r => r.status === 'success').length}
            </div>
            <div>
              ⚠️ Audio Errors: {Object.values(diagnosticResults).filter(r => r.status === 'audio-error').length}
            </div>
            <div>
              ❌ HTTP Errors: {Object.values(diagnosticResults).filter(r => r.status === 'http-error').length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioDiagnostic;
