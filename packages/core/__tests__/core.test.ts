const {
  isFunction,
} = require('..');

describe('core-utils', () => {
  it('isFunction', () => {
      const a = 1;
      const b = 'string';
      const c = [1];
      const d = function() {};
      const e = function *() {};
      expect(isFunction(a)).toBe(false);
      expect(isFunction(b)).toBe(false);
      expect(isFunction(c)).toBe(false);
      expect(isFunction(d)).toBe(true);
      expect(isFunction(e)).toBe(true);
    });
});
