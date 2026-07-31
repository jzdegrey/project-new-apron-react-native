import { createLogger } from './logger';

describe('createLogger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs info messages as structured JSON at the default level', () => {
    const logger = createLogger('info', 'mobile');
    logger.info('hello', { userId: '123' });

    expect(console.info).toHaveBeenCalledTimes(1);
    const payload = JSON.parse((console.info as jest.Mock).mock.calls[0][0]);
    expect(payload).toMatchObject({
      level: 'info',
      message: 'hello',
      context: 'mobile',
      meta: { userId: '123' },
    });
  });

  it('suppresses debug logs below the configured level', () => {
    const logger = createLogger('info', 'mobile');
    logger.debug('should not appear');
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('still emits error logs when the level is raised', () => {
    const logger = createLogger('error', 'mobile');
    logger.warn('should not appear');
    logger.error('boom');

    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('falls back to info when given an unknown level', () => {
    const logger = createLogger('verbose', 'mobile');
    logger.debug('should not appear');
    logger.info('should appear');

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledTimes(1);
  });
});
