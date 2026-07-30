import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { LandingScreen } from './LandingScreen';

const onSignIn = jest.fn();
const onCreateAccount = jest.fn();

beforeEach(() => {
  onSignIn.mockReset();
  onCreateAccount.mockReset();
});

async function renderLandingScreen() {
  return render(<LandingScreen onSignIn={onSignIn} onCreateAccount={onCreateAccount} />);
}

describe('LandingScreen', () => {
  it('renders the wordmark and tagline', async () => {
    await renderLandingScreen();
    expect(screen.getByText('Project New Apron')).toBeTruthy();
    expect(screen.getByText('Plan meals. Save recipes. Eat better — together.')).toBeTruthy();
  });

  it('calls onCreateAccount when the primary CTA is pressed', async () => {
    await renderLandingScreen();
    await fireEvent.press(screen.getByTestId('landing-create-account-button'));
    expect(onCreateAccount).toHaveBeenCalledTimes(1);
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('calls onSignIn when the secondary CTA is pressed', async () => {
    await renderLandingScreen();
    await fireEvent.press(screen.getByTestId('landing-sign-in-button'));
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onCreateAccount).not.toHaveBeenCalled();
  });

  it('shows the current year in the footer copyright notice', async () => {
    await renderLandingScreen();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeTruthy();
  });

  it('shows Terms of Service and Privacy Policy links', async () => {
    await renderLandingScreen();
    expect(screen.getByText('Terms of Service')).toBeTruthy();
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
  });
});
