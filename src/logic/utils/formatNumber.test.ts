import { describe, test, expect } from 'vitest';
import { formatNumber } from './formatNumber.ts';

describe('formatDecimal', () => {
  describe('should convert to correct format', () => {
    test.each([
      [1, '1'],
      [1111, '1 111'],
      [11.1111, '11.1111'],
      [1111.1111, '1 111.1111'],
      [1111111.1111, '1 111 111.1111'],
    ])('expect %d to match %s', (number, expected) => {
      const formatted = formatNumber(number);

      expect(formatted).toBe(expected);
    });
  });
});
