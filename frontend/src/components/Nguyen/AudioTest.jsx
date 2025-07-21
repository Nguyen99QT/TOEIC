import React, { useRef, useState } from 'react';

const AudioTest = () => {
  const audioRef = useRef(null);
  const [status, setStatus] = useState('Ready to test');
  const [isPlaying, setIsPlaying] = useState(false);

  const testAudio = () => {
    const audioUrl = 'http://localhost:8080/uploads/audio/sample_part1_audio.mp3';
    setStatus(`Testing audio: ${audioUrl}`);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      
      audioRef.current.onloadstart = () => {
        setStatus('Audio loading started...');
      };
      
      audioRef.current.oncanplay = () => {
        setStatus('Audio ready to play');
      };
      
      audioRef.current.onplay = () => {
        setStatus('Audio is playing');
        setIsPlaying(true);
      };
      
      audioRef.current.onpause = () => {
        setStatus('Audio paused');
        setIsPlaying(false);
      };
      
      audioRef.current.onended = () => {
        setStatus('Audio ended');
        setIsPlaying(false);
      };
      
      audioRef.current.onerror = (e) => {
        setStatus(`Audio error: ${e.target.error?.message || 'Unknown error'}`);
        setIsPlaying(false);
      };
      
      audioRef.current.play().catch(error => {
        setStatus(`Play failed: ${error.message}`);
        setIsPlaying(false);
      });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🎧 Audio Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Playing:</strong> {isPlaying ? '✅ Yes' : '❌ No'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testAudio}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          🎵 Test Audio
        </button>
        
        <button
          onClick={stopAudio}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ⏹️ Stop
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f9fafb', 
        border: '1px solid #e5e7eb', 
        padding: '15px', 
        borderRadius: '5px' 
      }}>
        <h3>Audio Sources to Test:</h3>
        <ul>
          <li>
            <a 
              href="http://localhost:8080/uploads/audio/sample_part1_audio.mp3" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Part 1 Audio
            </a>
          </li>
          <li>
            <a 
              href="http://localhost:8080/uploads/audio/sample_part2_audio.mp3" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Part 2 Audio
            </a>
          </li>
        </ul>
      </div>
      
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default AudioTest;
