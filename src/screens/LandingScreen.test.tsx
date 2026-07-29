import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { LandingScreen } from './LandingScreen';

const onPressSignIn = jest.fn();
const onPressCreateAccount = jest.fn();

async function renderLandingScreen() {
  return render(
    <LandingScreen onPressSignIn={onPressSignIn} onPressCreateAccount={onPressCreateAccount} />,
  );
}

beforeEach(() => {
  onPressSignIn.mockReset();
  onPressCreateAccount.mockReset();
});

it('renders the wordmark and tagline', async () => {
  await renderLandingScreen();

  expect(screen.getByText('Project New Apron')).toBeTruthy();
  expect(screen.getByText('Plan meals. Save recipes. Eat better — together.')).toBeTruthy();
});

it('calls onPressCreateAccount when the primary CTA is pressed', async () => {
  await renderLandingScreen();

  await fireEvent.press(screen.getByTestId('landing-create-account-button'));

  expect(onPressCreateAccount).toHaveBeenCalled();
  expect(onPressSignIn).not.toHaveBeenCalled();
});

it('calls onPressSignIn when the secondary CTA is pressed', async () => {
  await renderLandingScreen();

  await fireEvent.press(screen.getByTestId('landing-sign-in-button'));

  expect(onPressSignIn).toHaveBeenCalled();
  expect(onPressCreateAccount).not.toHaveBeenCalled();
});
