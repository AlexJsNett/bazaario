import type { ProductId } from '../logic/favorites';

export const FAVORITES_KEY = 'favorites';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function saveFavorites(
  storage: StorageLike,
  favorites: readonly ProductId[],
): void {
  storage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function loadFavorites(storage: StorageLike): ProductId[] {
  const raw = storage.getItem(FAVORITES_KEY);
  if (raw === null) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (id): id is ProductId => typeof id === 'number' || typeof id === 'string',
    );
  } catch {
    return [];
  }
}
