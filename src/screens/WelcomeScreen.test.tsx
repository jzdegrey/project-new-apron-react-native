import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { WelcomeScreen } from './WelcomeScreen';
import { ToastProvider } from '../components/Toast';

const onSignOut = jest.fn();

async function renderWelcomeScreen(token = 'tok123') {
  return render(
    <ToastProvider>
      <WelcomeScreen token={token} onSignOut={onSignOut} />
    </ToastProvider>,
  );
}

beforeEach(() => {
  onSignOut.mockReset();
  globalThis.fetch = jest.fn();
});

it('shows a loading indicator while fetching the current user', async () => {
  let resolveFetch: (value: unknown) => void = () => {};
  (globalThis.fetch as jest.Mock).mockReturnValue(
    new Promise(resolve => {
      resolveFetch = resolve;
    }),
  );
  await renderWelcomeScreen();
  expect(screen.getByTestId('welcome-loading')).toBeTruthy();

  resolveFetch({ ok: true, json: async () => ({}) });
  await waitFor(() => expect(screen.queryByTestId('welcome-loading')).toBeNull());
});

it('greets the signed-in user once loaded', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 1,
      username: 'janedoe1',
      first_name: 'Jane',
      last_name: 'Doe',
      date_of_birth: '2000-01-01',
      email: null,
      phone_number: null,
      email_subscription_opt_in: true,
      created_at: '2026-01-01T00:00:00Z',
    }),
  });
  await renderWelcomeScreen();

  expect(await screen.findByText('Welcome, Jane!')).toBeTruthy();
  expect(screen.getByText("You're signed in as janedoe1.")).toBeTruthy();
});

it('signs the user out when the session is invalid', async () => {
  (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });
  await renderWelcomeScreen();

  await waitFor(() => expect(onSignOut).toHaveBeenCalled());
});
