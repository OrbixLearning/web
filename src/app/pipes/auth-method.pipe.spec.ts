import { AuthMethodPipe } from './auth-method.pipe';

describe('AuthMethodPipe', () => {
  it('create an instance', () => {
    const pipe = new AuthMethodPipe();
    expect(pipe).toBeTruthy();
  });
});
