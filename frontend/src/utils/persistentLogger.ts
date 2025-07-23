// Persistent Error Logger - survives page refreshes and navigation
class PersistentLogger {
  private static instance: PersistentLogger;
  private logKey = 'app_debug_logs';
  private maxLogs = 50;

  static getInstance(): PersistentLogger {
    if (!PersistentLogger.instance) {
      PersistentLogger.instance = new PersistentLogger();
    }
    return PersistentLogger.instance;
  }

  log(message: string, level: 'info' | 'error' | 'warn' | 'debug' = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      page: window.location.pathname
    };

    console.log(`[${level.toUpperCase()}] ${message}`);

    const logs = this.getLogs();
    logs.push(logEntry);

    // Keep only recent logs
    if (logs.length > this.maxLogs) {
      logs.splice(0, logs.length - this.maxLogs);
    }

    localStorage.setItem(this.logKey, JSON.stringify(logs));
  }

  getLogs() {
    try {
      const saved = localStorage.getItem(this.logKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem(this.logKey);
  }

  info(message: string) { this.log(message, 'info'); }
  error(message: string) { this.log(message, 'error'); }
  warn(message: string) { this.log(message, 'warn'); }
  debug(message: string) { this.log(message, 'debug'); }
}

export const persistentLogger = PersistentLogger.getInstance();
