import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AuthScreen } from './AuthScreen';
import { ToastProvider } from '../components/Toast';

const onAuthenticated = jest.fn();

async function renderAuthScreen() {
  return render(
    <ToastProvider>
      <AuthScreen onAuthenticated={onAuthenticated} />
    </ToastProvider>,
  );
}

function submitButton() {
  return screen.getByTestId('auth-submit-button');
}

function switchModeButton() {
  return screen.getByTestId('auth-switch-mode-button');
}

beforeEach(() => {
  onAuthenticated.mockReset();
  globalThis.fetch = jest.fn();
});

describe('AuthScreen - sign in mode', () => {
  it('renders sign-in fields by default', async () => {
    await renderAuthScreen();
    expect(screen.getByRole('header').props.children).toBe('Sign In');
    expect(screen.getByLabelText('Username')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.queryByLabelText('Confirm Password')).toBeNull();
  });

  it('blocks submission and shows errors when fields are empty', async () => {
    await renderAuthScreen();

    await fireEvent.press(submitButton());

    expect(await screen.findByText('Username is required.')).toBeTruthy();
    expect(screen.getByText('Password is required.')).toBeTruthy();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('authenticates on valid credentials', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'tok123', token_type: 'bearer' }),
    });
    await renderAuthScreen();

    await fireEvent.changeText(screen.getByLabelText('Username'), 'janedoe1');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'sup3rSecret!');
    await fireEvent.press(submitButton());

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledWith('tok123'));
  });

  it('shows a form-level error on invalid credentials', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Incorrect username or password.' }),
    });
    await renderAuthScreen();

    await fireEvent.changeText(screen.getByLabelText('Username'), 'janedoe1');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'wrong-password');
    await fireEvent.press(submitButton());

    expect(await screen.findByText('Incorrect username or password.')).toBeTruthy();
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it('toggles password visibility', async () => {
    await renderAuthScreen();
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByLabelText('Show password'));
    expect(passwordInput.props.secureTextEntry).toBe(false);

    await fireEvent.press(screen.getByLabelText('Hide password'));
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });
});

describe('AuthScreen - create account mode', () => {
  it('switches to create-account fields', async () => {
    await renderAuthScreen();
    await fireEvent.press(switchModeButton());

    expect(screen.getByRole('header').props.children).toBe('Create Account');
    expect(screen.getByLabelText('Confirm Password')).toBeTruthy();
    expect(screen.getByLabelText('First Name')).toBeTruthy();
    expect(screen.getByLabelText('Last Name')).toBeTruthy();
  });

  it('shows live feedback when passwords do not match', async () => {
    await renderAuthScreen();
    await fireEvent.press(switchModeButton());

    await fireEvent.changeText(screen.getByLabelText('Password'), 'sup3rSecret!');
    await fireEvent.changeText(screen.getByLabelText('Confirm Password'), 'different!');

    expect(await screen.findByText('Passwords do not match.')).toBeTruthy();
  });

  it('shows live positive feedback when passwords match', async () => {
    await renderAuthScreen();
    await fireEvent.press(switchModeButton());

    await fireEvent.changeText(screen.getByLabelText('Password'), 'sup3rSecret!');
    await fireEvent.changeText(screen.getByLabelText('Confirm Password'), 'sup3rSecret!');

    expect(await screen.findByText('Passwords match.')).toBeTruthy();
  });

  it('blocks submission when terms are not agreed to', async () => {
    await renderAuthScreen();
    await fireEvent.press(switchModeButton());

    await fireEvent.changeText(screen.getByLabelText('Username'), 'janedoe1');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'sup3rSecret!');
    await fireEvent.changeText(screen.getByLabelText('Confirm Password'), 'sup3rSecret!');
    await fireEvent.changeText(screen.getByLabelText('First Name'), 'Jane');
    await fireEvent.changeText(screen.getByLabelText('Last Name'), 'Doe');
    await fireEvent.changeText(screen.getByLabelText('Date of Birth'), '2000-01-01');

    await fireEvent.press(submitButton());

    expect(
      await screen.findByText('You must agree to the Terms of Service and Privacy Policy.'),
    ).toBeTruthy();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('email subscription switch defaults to on', async () => {
    await renderAuthScreen();
    await fireEvent.press(switchModeButton());

    expect(screen.getByLabelText('Sign up for email updates').props.value).toBe(true);
  });
});
