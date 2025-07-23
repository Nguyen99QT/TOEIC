import React, { useEffect, useState } from 'react';

const ErrorLogger: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Override console.error to capture errors
    const originalConsoleError = console.error;

    console.error = (...args: any[]) => {
      // Call original console.error
      originalConsoleError(...args);

      // Store error in localStorage and state
      const errorMessage = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] ${errorMessage}`;

      // Save to localStorage
      const existingLogs = localStorage.getItem('error_logs') || '[]';
      const logs = JSON.parse(existingLogs);
      logs.push(logEntry);

      // Keep only last 50 logs
      if (logs.length > 50) {
        logs.shift();
      }

      localStorage.setItem('error_logs', JSON.stringify(logs));
      setErrors([...logs]);
    };

    // Load existing errors from localStorage
    const existingLogs = localStorage.getItem('error_logs');
    if (existingLogs) {
      setErrors(JSON.parse(existingLogs));
    }

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('error_logs');
    setErrors([]);
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-red-800">Error Log</h3>
        <button
          onClick={clearLogs}
          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
        >
          Clear
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {errors.length === 0 ? (
          <p className="text-xs text-gray-500">No errors logged</p>
        ) : (
          errors.slice(-10).map((error, index) => (
            <div key={index} className="text-xs text-red-700 mb-1 p-1 bg-red-100 rounded">
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorLogger;
