import { describe, it, expect } from 'vitest';
import { getAverageRating, getRatingBreakdown, getReviewItems, getReviews } from './reviews';
import type { Review, ReviewItem } from '@/types/reviews.ts';

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

const item = (rating: number): ReviewItem => ({
  author: 'A',
  rating,
  date: '2026-01-01',
  title: 't',
  text: 'x',
});

describe('getReviewItems', () => {
  it('should return the items of the product', () => {
    const reviews: Review[] = [{ productId: 1, count: 5, items: [item(5)] }];
    expect(getReviewItems(reviews, 1)).toEqual([item(5)]);
  });

  it('should return an empty array for no items or an unknown product', () => {
    expect(getReviewItems([{ productId: 1, count: 5 }], 1)).toEqual([]);
    expect(getReviewItems([], 9)).toEqual([]);
  });
});

describe('getRatingBreakdown', () => {
  it('should count reviews by stars, 5 stars first', () => {
    expect(getRatingBreakdown([item(5), item(5), item(3), item(1)])).toEqual([2, 0, 1, 0, 1]);
  });

  it('should ignore a rating out of 1..5', () => {
    expect(getRatingBreakdown([item(0), item(6)])).toEqual([0, 0, 0, 0, 0]);
  });

  it('should return zeros for an empty list', () => {
    expect(getRatingBreakdown([])).toEqual([0, 0, 0, 0, 0]);
  });
});

describe('getAverageRating', () => {
  it('should round to one decimal', () => {
    expect(getAverageRating([item(5), item(4), item(4)])).toBe(4.3);
  });

  it('should return 0 for an empty list', () => {
    expect(getAverageRating([])).toBe(0);
  });
});
