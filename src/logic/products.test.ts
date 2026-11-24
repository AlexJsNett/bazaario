import { describe, expect, it } from 'vitest';
import type { Product } from '@/types/product';
import { getProductById, getRecommendations } from './products';

const make = (id: number, category = 'Tablets', rating = 4): Product => ({
  id,
  title: `Product ${id}`,
  category,
  price: 10,
  rating,
  image: `images/${id}.png`,
  description: 'Description',
});

describe('getProductById', () => {
  it('returns the product with the given id', () => {
    const products = [make(1), make(2), make(3)];
    expect(getProductById(products, 2)).toBe(products[1]);
  });

  it('returns undefined when the id is not found', () => {
    expect(getProductById([make(1)], 99)).toBeUndefined();
  });

  it('returns undefined for an empty list', () => {
    expect(getProductById([], 1)).toBeUndefined();
  });

  it('does not mutate the input', () => {
    const products = [make(1), make(2)];
    const snapshot = structuredClone(products);
    getProductById(products, 1);
    expect(products).toEqual(snapshot);
  });
});

describe('getRecommendations', () => {
  const ids = (list: Product[]) => list.map((product) => product.id);

  it('takes the same category, best rating first, without the product itself', () => {
    const products = [make(1, 'A', 4), make(2, 'A', 3), make(3, 'A', 5), make(4, 'B', 5)];
    expect(ids(getRecommendations(products, products[0], 2))).toEqual([3, 2]);
  });

  it('fills the rest with the best of other categories', () => {
    const products = [make(1, 'A'), make(2, 'A', 3), make(3, 'B', 4), make(4, 'C', 5)];
    expect(ids(getRecommendations(products, products[0], 3))).toEqual([2, 4, 3]);
  });

  it('returns fewer than the limit when there are not enough products', () => {
    const products = [make(1), make(2)];
    expect(ids(getRecommendations(products, products[0]))).toEqual([2]);
  });

  it('returns an empty array for a limit of 0 and does not mutate', () => {
    const products = [make(1), make(2)];
    const snapshot = structuredClone(products);
    expect(getRecommendations(products, products[0], 0)).toEqual([]);
    expect(products).toEqual(snapshot);
  });
});
