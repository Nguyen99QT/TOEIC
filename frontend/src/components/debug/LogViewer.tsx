import React, { useEffect, useState } from 'react';
import { persistentLogger } from '../../utils/persistentLogger';

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateLogs = () => setLogs(persistentLogger.getLogs());

    updateLogs(); // Initial load

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateLogs, 1000); // Update every second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Persistent Application Logs</h2>
        <div className="space-x-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            Auto Refresh
          </label>
          <button
            onClick={() => setLogs(persistentLogger.getLogs())}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              persistentLogger.clearLogs();
              setLogs([]);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Clear Logs
          </button>
        </div>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs available</div>
        ) : (
          logs.slice(-100).map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-400">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span className={`ml-2 ${log.level === 'error' ? 'text-red-400' :
                  log.level === 'warn' ? 'text-yellow-400' :
                    log.level === 'info' ? 'text-blue-400' :
                      'text-green-400'
                }`}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="text-purple-400 ml-2">{log.page}</span>
              <span className="ml-2">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total logs: {logs.length} |
        Showing last 100 |
        Current page: {window.location.pathname}
      </div>
    </div>
  );
};

export default LogViewer;
