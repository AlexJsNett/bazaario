import { describe, expect, test } from 'vitest';
import { getDiscount } from './price.ts';

describe('price', () => {
  describe('compute discount correctly', () => {
    test.each([
      [100, 10, 90],
      [100, 50, 50],
      [100, 100, 0],
      [100, 0, 100],
      [100, 99, 1],
      [3, 2, 33],
      [3, 1, 67],
      [19.99, 14.99, 25],
      [200, 150, 25],
      [100, 150, 50],
    ])(
      'old price %d and current price %d should give discount %d',
      (oldPrice, newPrice, expected) => {
        const computedDiscount = getDiscount(newPrice, oldPrice);

        expect(computedDiscount).toBe(expected);
      },
    );
  });
});
