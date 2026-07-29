import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LabeledInput } from '../components/LabeledInput';
import { PasswordField } from '../components/PasswordField';
import { useToast } from '../components/Toast';
import { BackendApiError, loginUser, registerUser } from '../lib/apiClient';
import {
  validateConfirmPassword,
  validateDateOfBirth,
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
  validateUsername,
} from '../lib/validation';

type Mode = 'sign-in' | 'create-account';
type FieldErrors = Record<string, string | undefined>;

interface FormState {
  username: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone_number: string;
  agreed_to_terms: boolean;
  email_subscription_opt_in: boolean;
}

const INITIAL_STATE: FormState = {
  username: '',
  password: '',
  confirm_password: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  email: '',
  phone_number: '',
  agreed_to_terms: false,
  email_subscription_opt_in: true,
};

function validateCreateAccountForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {
    username: validateUsername(form.username) ?? undefined,
    password: validatePassword(form.password) ?? undefined,
    confirm_password: validateConfirmPassword(form.password, form.confirm_password) ?? undefined,
    first_name: validateName(form.first_name) ?? undefined,
    last_name: validateName(form.last_name) ?? undefined,
    date_of_birth: validateDateOfBirth(form.date_of_birth) ?? undefined,
    email: validateEmail(form.email) ?? undefined,
    phone_number: validatePhoneNumber(form.phone_number) ?? undefined,
  };
  if (!form.agreed_to_terms) {
    errors.agreed_to_terms = 'You must agree to the Terms of Service and Privacy Policy.';
  }
  return Object.fromEntries(Object.entries(errors).filter(([, value]) => value));
}

function validateSignInForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.username) {
    errors.username = 'Username is required.';
  }
  if (!form.password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

interface AuthScreenProps {
  onAuthenticated: (token: string) => void;
  initialMode?: Mode;
  onBack?: () => void;
}

export function AuthScreen({ onAuthenticated, initialMode = 'sign-in', onBack }: AuthScreenProps) {
  const { showToast } = useToast();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setErrors({});
    setFormError(null);
  }

  async function handleSubmit() {
    setFormError(null);
    const fieldErrors =
      mode === 'create-account' ? validateCreateAccountForm(form) : validateSignInForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'create-account') {
        await registerUser({
          ...form,
          email: form.email || undefined,
          phone_number: form.phone_number || undefined,
        });
      }
      const { access_token: accessToken } = await loginUser(form.username, form.password);
      onAuthenticated(accessToken);
    } catch (error) {
      if (error instanceof BackendApiError) {
        if (error.status === 422 && error.fieldErrors) {
          setErrors(error.fieldErrors);
        } else if (error.status === 401 || error.status === 423 || error.status === 409) {
          setFormError(error.message);
        } else {
          showToast(error.message);
        }
      } else {
        showToast('Unable to reach the server. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {onBack && (
        <TouchableOpacity onPress={onBack} accessibilityRole="button" testID="auth-back-button">
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.heading} accessibilityRole="header">
        {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
      </Text>

      <LabeledInput
        label="Username"
        value={form.username}
        onChangeText={value => updateField('username', value)}
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.username}
      />

      <PasswordField
        label="Password"
        value={form.password}
        onChangeText={value => updateField('password', value)}
        error={errors.password}
        helperText={
          mode === 'create-account' && form.password
            ? validatePassword(form.password) ?? 'Password meets the length requirement.'
            : undefined
        }
        helperIsValid={!validatePassword(form.password)}
      />

      {mode === 'create-account' && (
        <>
          <PasswordField
            label="Confirm Password"
            value={form.confirm_password}
            onChangeText={value => updateField('confirm_password', value)}
            error={errors.confirm_password}
            helperText={
              form.confirm_password
                ? validateConfirmPassword(form.password, form.confirm_password) ?? 'Passwords match.'
                : undefined
            }
            helperIsValid={!validateConfirmPassword(form.password, form.confirm_password)}
          />

          <LabeledInput
            label="First Name"
            value={form.first_name}
            onChangeText={value => updateField('first_name', value)}
            error={errors.first_name}
          />

          <LabeledInput
            label="Last Name"
            value={form.last_name}
            onChangeText={value => updateField('last_name', value)}
            error={errors.last_name}
          />

          <LabeledInput
            label="Date of Birth"
            value={form.date_of_birth}
            onChangeText={value => updateField('date_of_birth', value)}
            placeholder="YYYY-MM-DD"
            error={errors.date_of_birth}
          />

          <LabeledInput
            label="Email (optional)"
            value={form.email}
            onChangeText={value => updateField('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />

          <LabeledInput
            label="Phone Number (optional)"
            value={form.phone_number}
            onChangeText={value => updateField('phone_number', value)}
            keyboardType="phone-pad"
            error={errors.phone_number}
          />

          <View style={styles.switchRow}>
            <Switch
              value={form.agreed_to_terms}
              onValueChange={value => updateField('agreed_to_terms', value)}
              accessibilityLabel="Agree to Terms of Service and Privacy Policy"
            />
            <Text style={styles.switchLabel}>
              I agree to the{' '}
              <Text style={styles.link} onPress={() => Linking.openURL('#')}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={() => Linking.openURL('#')}>
                Privacy Policy
              </Text>
            </Text>
          </View>
          {errors.agreed_to_terms && <Text style={styles.errorText}>{errors.agreed_to_terms}</Text>}

          <View style={styles.switchRow}>
            <Switch
              value={form.email_subscription_opt_in}
              onValueChange={value => updateField('email_subscription_opt_in', value)}
              accessibilityLabel="Sign up for email updates"
            />
            <Text style={styles.switchLabel}>Sign up for email updates</Text>
          </View>
        </>
      )}

      {formError && <Text style={styles.errorText}>{formError}</Text>}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
        accessibilityRole="button"
        testID="auth-submit-button">
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => switchMode(mode === 'sign-in' ? 'create-account' : 'sign-in')}
        accessibilityRole="button"
        testID="auth-switch-mode-button">
        <Text style={styles.switchModeText}>
          {mode === 'sign-in' ? 'Create Account' : 'Sign In'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  backText: {
    color: '#0070f3',
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
  },
  link: {
    color: '#0070f3',
  },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: '#0070f3',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  switchModeText: {
    color: '#0070f3',
    fontSize: 14,
    textAlign: 'center',
  },
});
