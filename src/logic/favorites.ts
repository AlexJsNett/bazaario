// Pure functions: take an array of product ids, return a new value. Never mutate the input.

export function toggleFavorite(favorites: number[], productId: number): number[] {
  return favorites.includes(productId)
    ? favorites.filter((id) => id !== productId)
    : [...favorites, productId];
}

export function isFavorite(favorites: number[], productId: number): boolean {
  return favorites.includes(productId);
}

export function getFavoritesCount(favorites: number[]): number {
  return favorites.length;
}
