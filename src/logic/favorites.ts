export type ProductId = number | string;

export function toggleFavorite(
  favorites: readonly ProductId[],
  productId: ProductId,
): ProductId[] {
  if (favorites.includes(productId)) {
    return favorites.filter((id) => id !== productId);
  }
  return [...favorites, productId];
}

export function isFavorite(
  favorites: readonly ProductId[],
  productId: ProductId,
): boolean {
  return favorites.includes(productId);
}

export function getFavoritesCount(favorites: readonly ProductId[]): number {
  return favorites.length;
}
