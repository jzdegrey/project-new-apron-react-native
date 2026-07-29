import { parseAppEnv } from './globals';

describe('parseAppEnv', () => {
  it.each(['local', 'stg', 'prod'] as const)('accepts "%s"', value => {
    expect(parseAppEnv(value)).toBe(value);
  });

  it('throws for an invalid value', () => {
    expect(() => parseAppEnv('production')).toThrow(/APP_ENV must be one of/);
  });

  it('throws when the value is missing', () => {
    expect(() => parseAppEnv(undefined)).toThrow(/APP_ENV must be one of/);
  });
});
