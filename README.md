# project-new-apron-react-native

React Native code for Project New Apron — a React Native (TypeScript) mobile app for iOS and Android.

## Getting started

1. Copy `.env.example` to `.env` and fill in real values — the app fails
   fast on startup if `APP_ENV` is missing or invalid.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Metro and run the app:

   ```bash
   npm start
   npm run android   # or: npm run ios
   ```

   Android/iOS builds require the native Android SDK / Xcode toolchains
   (not available in this container) — `docker compose up` only runs the
   Metro bundler, which is useful for JS-only iteration but not for
   building/running the native app itself.

## Scripts

- `npm start` — start the Metro bundler
- `npm run android` / `npm run ios` — build and run the native app
- `npm run lint` — lint with ESLint
- `npm test` — run the Jest test suite

## Project structure

- `App.tsx` / `index.js` — app entry point
- `src/config/globals.ts` — global, project-level configuration inlined
  from `.env` at build time (via `react-native-dotenv`), including
  `APP_ENV` (`local` | `stg` | `prod`)
- `src/lib/logger.ts` — shared logger that writes structured JSON lines to
  `console`, visible in Metro/device logs

## Configuration

All configuration and secrets are read from environment variables via a
`.env` file (see `.env.example`), never committed to source control.
`.env` values are inlined into the JS bundle at build time, so only put
values there that are safe to ship inside the app binary. `APP_ENV` must
be one of `local`, `stg`, or `prod`; the app fails fast on startup if it
is missing or invalid.
