import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useToast } from '../components/Toast';
import { BackendUser, getCurrentUser } from '../lib/apiClient';

interface WelcomeScreenProps {
  token: string;
  onSignOut: () => void;
}

export function WelcomeScreen({ token, onSignOut }: WelcomeScreenProps) {
  const { showToast } = useToast();
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser(token)
      .then(result => {
        if (cancelled) {
          return;
        }
        if (!result) {
          showToast('Your session has expired. Please sign in again.');
          onSignOut();
          return;
        }
        setUser(result);
      })
      .catch(() => {
        if (!cancelled) {
          showToast('Unable to reach the server. Please check your connection and try again.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <View style={styles.container} testID="welcome-loading">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome{user ? `, ${user.first_name}` : ''}!</Text>
      {user && <Text style={styles.subtitle}>You&apos;re signed in as {user.username}.</Text>}
      <TouchableOpacity style={styles.signOutButton} onPress={onSignOut} accessibilityRole="button">
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  signOutButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  signOutText: {
    fontSize: 14,
  },
});
