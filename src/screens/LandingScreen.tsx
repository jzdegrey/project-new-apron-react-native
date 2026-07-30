import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SELL_POINTS = [
  'Plan meals for any date range and collaborate with family & friends',
  'Save and organize your favorite recipes in one place',
  'Grocery integrations with Kroger, Walmart, and Target — on the roadmap',
];

interface LandingScreenProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function LandingScreen({ onSignIn, onCreateAccount }: LandingScreenProps) {
  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.wordmark}>Project New Apron</Text>
        <Text style={styles.tagline}>Plan meals. Save recipes. Eat better — together.</Text>
        <Text style={styles.subtitle}>
          Project New Apron helps you plan meals, store and share recipes, and eat better — all in
          one place.
        </Text>

        <View style={styles.sellPoints}>
          {SELL_POINTS.map(point => (
            <Text key={point} style={styles.sellPoint}>
              {'•'} {point}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onCreateAccount}
          accessibilityRole="button"
          testID="landing-create-account-button">
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignIn}
          accessibilityRole="button"
          testID="landing-sign-in-button">
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{'©'} {year} Project New Apron</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink} onPress={() => Linking.openURL('#')}>
            Terms of Service
          </Text>
          <Text style={styles.footerLink} onPress={() => Linking.openURL('#')}>
            Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sellPoints: {
    gap: 6,
    alignSelf: 'stretch',
  },
  sellPoint: {
    fontSize: 13,
    color: '#666',
  },
  primaryButton: {
    alignSelf: 'stretch',
    backgroundColor: '#0070f3',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    padding: 16,
    gap: 8,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  footerLink: {
    fontSize: 12,
    color: '#0070f3',
  },
});
