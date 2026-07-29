/**
 * @format
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { ToastProvider } from './src/components/Toast';
import { AuthScreen } from './src/screens/AuthScreen';
import { LandingScreen } from './src/screens/LandingScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { logger } from './src/lib/logger';
import { clearToken, loadToken, saveToken } from './src/lib/tokenStorage';

type UnauthenticatedView = 'landing' | 'auth';
type AuthMode = 'sign-in' | 'create-account';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [token, setToken] = useState<string | null>(null);
  const [restoringSession, setRestoringSession] = useState(true);
  const [view, setView] = useState<UnauthenticatedView>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('sign-in');

  useEffect(() => {
    logger.info('App mounted');
    loadToken()
      .then(setToken)
      .finally(() => setRestoringSession(false));
  }, []);

  async function handleAuthenticated(accessToken: string) {
    await saveToken(accessToken);
    setToken(accessToken);
  }

  async function handleSignOut() {
    await clearToken();
    setToken(null);
    setView('landing');
  }

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setView('auth');
  }

  if (restoringSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {token ? (
        <WelcomeScreen token={token} onSignOut={handleSignOut} />
      ) : view === 'landing' ? (
        <LandingScreen
          onPressSignIn={() => openAuth('sign-in')}
          onPressCreateAccount={() => openAuth('create-account')}
        />
      ) : (
        <AuthScreen
          onAuthenticated={handleAuthenticated}
          initialMode={authMode}
          onBack={() => setView('landing')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
