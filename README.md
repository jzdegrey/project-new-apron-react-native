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

- `App.tsx` / `index.js` — app entry point; when there's no session token it
  shows `LandingScreen` and then `AuthScreen`, otherwise `WelcomeScreen`
- `src/screens/LandingScreen.tsx` — public front/splash screen (wordmark,
  tagline, and Sign In / Create Account CTAs)
- `src/screens/AuthScreen.tsx` — combined sign-in / create-account screen;
  accepts an `initialMode` (which CTA was tapped on `LandingScreen`) and an
  optional `onBack` to return to it
- `src/screens/WelcomeScreen.tsx` — post-sign-in confirmation screen
- `src/components` — shared components (`PasswordField`, `LabeledInput`, `Toast`)
- `src/lib/validation.ts` — client-side field validation mirroring the
  backend's rules, used for live form feedback
- `src/lib/apiClient.ts` — typed fetch wrapper for the backend auth API
- `src/lib/tokenStorage.ts` — persists the session token in the platform
  Keychain/Keystore via `react-native-keychain`
- `src/config/globals.ts` — global, project-level configuration inlined
  from `.env` at build time (via `react-native-dotenv`), including
  `APP_ENV` (`local` | `stg` | `prod`) and `API_BASE_URL` (the backend's base URL)
- `src/lib/logger.ts` — shared logger that writes structured JSON lines to
  `console`, visible in Metro/device logs

## Authentication

Unauthenticated users land on `LandingScreen` first. Tapping either CTA opens
`AuthScreen` pre-set to the matching mode; sign-in and account creation share
that one screen, toggling between the two modes (mirroring the web
frontend's flow). On success, the backend's JWT is stored in the platform
Keychain/Keystore (not `AsyncStorage`, which is unencrypted) so it can't be
casually read off the device, and the app switches to `WelcomeScreen`.
`WelcomeScreen` verifies the stored token against the backend on mount and
signs the user out (back to `LandingScreen`) if it's no longer valid.

## Configuration

All configuration and secrets are read from environment variables via a
`.env` file (see `.env.example`), never committed to source control.
`.env` values are inlined into the JS bundle at build time, so only put
values there that are safe to ship inside the app binary. `APP_ENV` must
be one of `local`, `stg`, or `prod`; the app fails fast on startup if it
is missing or invalid. `API_BASE_URL` must point at a running instance of
the backend for sign-in/registration to work.
