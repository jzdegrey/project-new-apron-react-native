import * as Keychain from 'react-native-keychain';
import { clearToken, loadToken, saveToken } from './tokenStorage';

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

describe('tokenStorage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('saves the token under a fixed service name', async () => {
    await saveToken('abc.def.ghi');
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'session',
      'abc.def.ghi',
      { service: 'com.projectnewapron.session' },
    );
  });

  it('loads the token when credentials exist', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'session',
      password: 'abc.def.ghi',
    });
    await expect(loadToken()).resolves.toBe('abc.def.ghi');
  });

  it('returns null when no credentials are stored', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
    await expect(loadToken()).resolves.toBeNull();
  });

  it('clears the stored token', async () => {
    await clearToken();
    expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
      service: 'com.projectnewapron.session',
    });
  });
});
