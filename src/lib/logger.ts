/**
 * Minimal, dependency-free logger for the mobile app. Mirrors the frontend
 * web app's logger shape: structured JSON lines written to `console`,
 * visible in Metro/device logs.
 */
import { globals } from '../config/globals';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function isLogLevel(value: string): value is LogLevel {
  return value in LEVEL_ORDER;
}

export function createLogger(minLevel: string, context: string) {
  const threshold = isLogLevel(minLevel) ? minLevel : 'info';

  function write(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[threshold]) {
      return;
    }

    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...(meta ? { meta } : {}),
    });

    console[level === 'debug' ? 'debug' : level](line);
  }

  return {
    debug: (message: string, meta?: Record<string, unknown>) => write('debug', message, meta),
    info: (message: string, meta?: Record<string, unknown>) => write('info', message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => write('warn', message, meta),
    error: (message: string, meta?: Record<string, unknown>) => write('error', message, meta),
  };
}

export const logger = createLogger(globals.logLevel, 'mobile');
