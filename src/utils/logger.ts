enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
}

class Logger {
  private isDevelopment = __DEV__;
  private minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;

  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];
    return `[${timestamp}] ${levelStr}: ${message}${context ? ` | ${JSON.stringify(context)}` : ''}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  debug(message: string, context?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  error(message: string, error?: Error | any, context?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error instanceof Error
        ? { message: error.message, stack: error.stack, ...context }
        : { error, ...context };

      console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));

      // TODO: Send to crash reporting service in production
    }
  }
}

export const logger = new Logger();