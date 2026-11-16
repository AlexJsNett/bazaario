import { beforeEach, describe, expect, it } from 'vitest';
import {
  FAVORITES_KEY,
  loadFavorites,
  saveFavorites,
} from './favoritesStorage';

function createFakeStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

describe('favorites storage', () => {
  let storage: ReturnType<typeof createFakeStorage>;

  beforeEach(() => {
    storage = createFakeStorage();
  });

  it('returns an empty list when nothing is saved', () => {
    expect(loadFavorites(storage)).toEqual([]);
  });

  it('loads what was saved', () => {
    saveFavorites(storage, [1, 'a', 3]);
    expect(loadFavorites(storage)).toEqual([1, 'a', 3]);
  });

  it('returns an empty list for broken JSON', () => {
    storage.setItem(FAVORITES_KEY, '{oops');
    expect(loadFavorites(storage)).toEqual([]);
  });

  it('returns an empty list when the value is not an array', () => {
    storage.setItem(FAVORITES_KEY, '{"a":1}');
    expect(loadFavorites(storage)).toEqual([]);
  });

  it('ignores items that are not ids', () => {
    storage.setItem(FAVORITES_KEY, '[1, null, {"x":1}, "b"]');
    expect(loadFavorites(storage)).toEqual([1, 'b']);
  });
});
