/**
 * Persists the session token in the platform Keychain/Keystore (rather than
 * AsyncStorage, which is unencrypted) so it can't be read by other apps or
 * casually extracted from device storage.
 */
import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.projectnewapron.session';

export async function saveToken(token: string): Promise<void> {
  await Keychain.setGenericPassword('session', token, { service: SERVICE });
}

export async function loadToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({ service: SERVICE });
  return credentials ? credentials.password : null;
}

export async function clearToken(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
