import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LandingScreenProps {
  onPressSignIn: () => void;
  onPressCreateAccount: () => void;
}

export function LandingScreen({ onPressSignIn, onPressCreateAccount }: LandingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.wordmark}>Project New Apron</Text>
        <Text style={styles.tagline}>Plan meals. Save recipes. Eat better — together.</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onPressCreateAccount}
          accessibilityRole="button"
          testID="landing-create-account-button">
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onPressSignIn}
          accessibilityRole="button"
          testID="landing-sign-in-button">
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 12,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#0070f3',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0070f3',
    fontWeight: '600',
    fontSize: 16,
  },
});
