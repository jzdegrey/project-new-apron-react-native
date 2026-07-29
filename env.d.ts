// Ambient declaration for the virtual `@env` module provided by
// react-native-dotenv (babel.config.js), which inlines values from `.env`.
declare module '@env' {
  export const APP_ENV: string | undefined;
  export const API_BASE_URL: string | undefined;
  export const SESSION_SECRET: string | undefined;
  export const LOG_LEVEL: string | undefined;
}
