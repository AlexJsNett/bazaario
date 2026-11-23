// Pure functions: take an array of product ids, return a new value. Never mutate the input.

import type { ProductId } from '@/types/product';

export function toggleFavorite(favorites: ProductId[], productId: ProductId): ProductId[] {
  return favorites.includes(productId)
    ? favorites.filter((id) => id !== productId)
    : [...favorites, productId];
}

export function isFavorite(favorites: ProductId[], productId: ProductId): boolean {
  return favorites.includes(productId);
}

export function getFavoritesCount(favorites: ProductId[]): number {
  return favorites.length;
}
