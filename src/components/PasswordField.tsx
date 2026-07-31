import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  helperText?: string | null;
  helperIsValid?: boolean;
  testID?: string;
}

export function PasswordField({
  label,
  value,
  onChangeText,
  error,
  helperText,
  helperIsValid,
  testID,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          testID={testID}
          accessibilityLabel={label}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setVisible(current => !current)}
          accessibilityRole="button"
          accessibilityLabel={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}>
          <Text>{visible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {helperText && (
        <Text style={helperIsValid ? styles.hintValid : styles.hintInvalid}>{helperText}</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  toggleButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
  },
  hintValid: {
    color: '#1e7e34',
    fontSize: 13,
  },
  hintInvalid: {
    color: '#666',
    fontSize: 13,
  },
});
