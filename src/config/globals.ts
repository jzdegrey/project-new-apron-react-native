/**
 * Central place for global, project-level configuration.
 *
 * Values are inlined at build time from a `.env` file (see `.env.example`)
 * via the `react-native-dotenv` babel plugin, so secrets never live in
 * source control. `react-native-dotenv` inlines `@env` imports directly
 * into the compiled output, so parsing/validation is kept in a standalone
 * pure function (`parseAppEnv`) that unit tests can exercise without going
 * through that babel transform.
 */
import {
  APP_ENV as RAW_APP_ENV,
  API_BASE_URL,
  SESSION_SECRET,
  LOG_LEVEL,
} from '@env';

export type AppEnv = 'local' | 'stg' | 'prod';

const VALID_APP_ENVS: readonly AppEnv[] = ['local', 'stg', 'prod'];

function isAppEnv(value: string | undefined): value is AppEnv {
  return !!value && (VALID_APP_ENVS as readonly string[]).includes(value);
}

export function parseAppEnv(value: string | undefined): AppEnv {
  if (!isAppEnv(value)) {
    throw new Error(
      `APP_ENV must be one of ${VALID_APP_ENVS.join(', ')}, got "${
        value ?? 'undefined'
      }". Set it in your .env file (see .env.example).`,
    );
  }
  return value;
}

export const globals = {
  /** Which environment this instance is running in: local | stg | prod. */
  appEnv: parseAppEnv(RAW_APP_ENV),
  /** Base URL of the backend API this app talks to. */
  apiBaseUrl: API_BASE_URL ?? 'http://localhost:8000',
  /** Secret available for signing/encrypting locally-persisted data. */
  sessionSecret: SESSION_SECRET ?? '',
  /** Minimum level the logger will emit. */
  logLevel: LOG_LEVEL ?? 'info',
} as const;
