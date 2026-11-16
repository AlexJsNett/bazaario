import { describe, expect, it } from 'vitest';
import { getFavoritesCount, isFavorite, toggleFavorite } from './favorites';

describe('toggleFavorite', () => {
  it('adds an id that is not in the list', () => {
    expect(toggleFavorite([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it('removes an id that is already in the list', () => {
    expect(toggleFavorite([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it('toggling twice returns the original list', () => {
    expect(toggleFavorite(toggleFavorite([1], 5), 5)).toEqual([1]);
  });

  it('works with an empty list', () => {
    expect(toggleFavorite([], 1)).toEqual([1]);
  });

  it('does not mutate the input', () => {
    const favorites = Object.freeze([1, 2]);
    toggleFavorite(favorites, 3);
    toggleFavorite(favorites, 1);
    expect(favorites).toEqual([1, 2]);
  });
});

describe('isFavorite', () => {
  it('returns true when the id is in the list', () => {
    expect(isFavorite([1, 2], 2)).toBe(true);
  });

  it('returns false when the id is not in the list', () => {
    expect(isFavorite([1, 2], 3)).toBe(false);
  });

  it('returns false for an empty list', () => {
    expect(isFavorite([], 1)).toBe(false);
  });
});

describe('getFavoritesCount', () => {
  it('returns 0 for an empty list', () => {
    expect(getFavoritesCount([])).toBe(0);
  });

  it('returns the number of items', () => {
    expect(getFavoritesCount([1, 2, 3])).toBe(3);
  });
});
