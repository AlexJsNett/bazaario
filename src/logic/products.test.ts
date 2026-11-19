import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product';
import { getProductById } from './products';

const make = (id: number): Product => ({
  id,
  title: `Product ${id}`,
  category: 'Tablets',
  price: 10,
  rating: 4,
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
