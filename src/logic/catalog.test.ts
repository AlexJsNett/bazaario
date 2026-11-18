import { describe, expect, it } from 'vitest';
import {
  type Product,
  filterByCategory,
  filterByPrice,
  filterByRating,
  filterProducts,
  filtersToParams,
  parseFilters,
  searchProducts,
} from './catalog';

const products: Product[] = [
  { id: 1, title: 'Phone Case', category: 'electronics', price: 10, rating: 4.5 },
  { id: 2, title: 'Smart Phone', category: 'electronics', price: 500, rating: 4.8 },
  { id: 3, title: 'Cooking Book', category: 'books', price: 25, rating: 3.9 },
  { id: 4, title: 'Toy Car', category: 'toys', price: 15, rating: 4.1 },
];

const ids = (list: Product[]) => list.map((product) => product.id);

describe('searchProducts', () => {
  it('finds a part of the title', () => {
    expect(ids(searchProducts(products, 'phone'))).toEqual([1, 2]);
  });

  it('ignores letter case', () => {
    expect(ids(searchProducts(products, 'COOKING'))).toEqual([3]);
  });

  it('returns all products for an empty or blank query', () => {
    expect(searchProducts(products, '')).toEqual(products);
    expect(searchProducts(products, '   ')).toEqual(products);
  });

  it('returns an empty array when nothing is found', () => {
    expect(searchProducts(products, 'zzz')).toEqual([]);
  });

  it('does not mutate the input and returns a new array', () => {
    const copy = [...products];
    const result = searchProducts(products, '');
    expect(products).toEqual(copy);
    expect(result).not.toBe(products);
  });
});

describe('filterByCategory', () => {
  it('keeps only the chosen category', () => {
    expect(ids(filterByCategory(products, 'electronics'))).toEqual([1, 2]);
  });

  it("returns all products for 'all'", () => {
    expect(filterByCategory(products, 'all')).toEqual(products);
  });

  it('returns an empty array for an unknown category', () => {
    expect(filterByCategory(products, 'garden')).toEqual([]);
  });
});

describe('filterByPrice', () => {
  it('keeps products inside the range', () => {
    expect(ids(filterByPrice(products, 12, 100))).toEqual([3, 4]);
  });

  it('includes the boundaries (equal to min and to max)', () => {
    expect(ids(filterByPrice(products, 10, 25))).toEqual([1, 3, 4]);
  });

  it('ignores a missing bound', () => {
    expect(ids(filterByPrice(products, 100))).toEqual([2]);
    expect(ids(filterByPrice(products, undefined, 15))).toEqual([1, 4]);
    expect(filterByPrice(products)).toEqual(products);
  });

  it('returns an empty array when min is greater than max', () => {
    expect(filterByPrice(products, 100, 10)).toEqual([]);
  });
});

describe('filterByRating', () => {
  it('keeps products with rating not lower than the limit', () => {
    expect(ids(filterByRating(products, 4.5))).toEqual([1, 2]);
  });

  it('returns all products for 0', () => {
    expect(filterByRating(products, 0)).toEqual(products);
  });

  it('returns an empty array when the limit is too high', () => {
    expect(filterByRating(products, 5)).toEqual([]);
  });
});

describe('filterProducts', () => {
  it('returns all products for empty filters', () => {
    expect(filterProducts(products, {})).toEqual(products);
    expect(filterProducts(products)).toEqual(products);
  });

  it('combines all filters', () => {
    const result = filterProducts(products, {
      query: 'phone',
      category: 'electronics',
      min: 5,
      max: 100,
      minRating: 4,
    });
    expect(ids(result)).toEqual([1]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterProducts(products, { query: 'book', category: 'toys' })).toEqual([]);
  });

  it('does not mutate the input', () => {
    const copy = structuredClone(products);
    filterProducts(products, { query: 'phone', max: 100 });
    expect(products).toEqual(copy);
  });
});

describe('parseFilters', () => {
  it('reads all filters from the query', () => {
    const params = new URLSearchParams('query=phone&category=books&min=10&max=50&minRating=4');
    expect(parseFilters(params)).toEqual({
      query: 'phone',
      category: 'books',
      min: 10,
      max: 50,
      minRating: 4,
    });
  });

  it('returns empty filters for an empty query', () => {
    expect(parseFilters(new URLSearchParams())).toEqual({});
  });

  it('ignores wrong numbers (text, empty, negative)', () => {
    const params = new URLSearchParams('min=abc&max=&minRating=-1&query=%20%20');
    expect(parseFilters(params)).toEqual({});
  });

  it('keeps a valid zero', () => {
    expect(parseFilters(new URLSearchParams('min=0'))).toEqual({ min: 0 });
  });
});

describe('filtersToParams', () => {
  it('writes only the filled fields', () => {
    const params = filtersToParams({ query: 'phone', min: 10 });
    expect(params.toString()).toBe('query=phone&min=10');
  });

  it("does not write empty, blank or 'all' values", () => {
    const params = filtersToParams({ query: '  ', category: 'all' });
    expect(params.toString()).toBe('');
  });

  it('round trip: filters to params and back', () => {
    const filters = {
      query: 'smart phone',
      category: 'electronics',
      min: 5,
      max: 600,
      minRating: 4.5,
    };
    expect(parseFilters(filtersToParams(filters))).toEqual(filters);
  });
});
