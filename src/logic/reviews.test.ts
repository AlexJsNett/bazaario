import { describe, it, expect } from 'vitest';
import { getReviews } from './reviews';
import type { Review } from '@/types/reviews.ts';

const makeReviews = (): Review[] => [
  { productId: 1, count: 52 },
  { productId: 2, count: 7 },
];

describe('getReviews', () => {
  it('should return the count of the product', () => {
    expect(getReviews(makeReviews(), 2)).toBe(7);
  });

  it('should return 0 when the product has no reviews data', () => {
    expect(getReviews(makeReviews(), 99)).toBe(0);
  });

  it('should return 0 for an empty list', () => {
    expect(getReviews([], 1)).toBe(0);
  });

  it('should not mutate the input', () => {
    const reviews = makeReviews();
    getReviews(reviews, 1);
    expect(reviews).toEqual(makeReviews());
  });
});
