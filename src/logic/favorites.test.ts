import { describe, expect, it } from 'vitest';
import { getFavoritesCount, isFavorite, toggleFavorite } from './favorites';

describe('toggleFavorite', () => {
  it('adds a product that is not in favorites', () => {
    expect(toggleFavorite([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it('removes a product that is already in favorites', () => {
    expect(toggleFavorite([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it('toggling twice returns the same list', () => {
    expect(toggleFavorite(toggleFavorite([1], 5), 5)).toEqual([1]);
  });

  it('works with an empty list', () => {
    expect(toggleFavorite([], 7)).toEqual([7]);
  });

  it('does not mutate the input', () => {
    const favorites = [1, 2];
    toggleFavorite(favorites, 3);
    toggleFavorite(favorites, 1);
    expect(favorites).toEqual([1, 2]);
  });
});

describe('isFavorite', () => {
  it('returns true for a product in favorites', () => {
    expect(isFavorite([1, 2, 3], 2)).toBe(true);
  });

  it('returns false for a product not in favorites', () => {
    expect(isFavorite([1, 2, 3], 4)).toBe(false);
  });

  it('returns false for an empty list', () => {
    expect(isFavorite([], 1)).toBe(false);
  });
});

describe('getFavoritesCount', () => {
  it('returns 0 for an empty list', () => {
    expect(getFavoritesCount([])).toBe(0);
  });

  it('returns the number of products', () => {
    expect(getFavoritesCount([4, 8, 15])).toBe(3);
  });
});
