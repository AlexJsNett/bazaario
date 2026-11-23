import { describe, expect, it } from 'vitest';
import type { Product } from '@/types/product';
import {
  clampPage,
  countActiveFilters,
  filterByCategory,
  filterByPrice,
  filterByRating,
  filterProducts,
  filtersToParams,
  getCategories,
  getPageCount,
  getPageItems,
  paginate,
  parseFilters,
  searchProducts,
  sortProducts,
} from './catalog';

const make = (
  id: number,
  title: string,
  category: string,
  price: number,
  rating: number,
): Product => ({
  id,
  title,
  category,
  price,
  rating,
  image: `images/${id}.jpg`,
  description: `${title} description`,
});

const products: Product[] = [
  make(1, 'Phone Case', 'electronics', 10, 4.5),
  make(2, 'Smart Phone', 'electronics', 500, 4.8),
  make(3, 'Cooking Book', 'books', 25, 3.9),
  make(4, 'Toy Car', 'toys', 15, 4.1),
];

const ids = (list: Product[]) => list.map((product) => product.id);

describe('getCategories', () => {
  it('returns unique categories sorted by name', () => {
    expect(getCategories(products)).toEqual(['books', 'electronics', 'toys']);
  });

  it('returns an empty array for an empty input', () => {
    expect(getCategories([])).toEqual([]);
  });

  it('does not mutate the input', () => {
    const copy = structuredClone(products);
    getCategories(products);
    expect(products).toEqual(copy);
  });
});

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

describe('sortProducts', () => {
  it('price-asc: cheapest first', () => {
    expect(ids(sortProducts(products, 'price-asc'))).toEqual([1, 4, 3, 2]);
  });

  it('price-desc: most expensive first', () => {
    expect(ids(sortProducts(products, 'price-desc'))).toEqual([2, 3, 4, 1]);
  });

  it('rating-desc: best rating first', () => {
    expect(ids(sortProducts(products, 'rating-desc'))).toEqual([2, 1, 4, 3]);
  });

  it('default keeps the original order and returns a new array', () => {
    const result = sortProducts(products, 'default');
    expect(ids(result)).toEqual([1, 2, 3, 4]);
    expect(result).not.toBe(products);
  });

  it('keeps the original order for equal prices (stable)', () => {
    const same = [make(1, 'A', 'x', 10, 1), make(2, 'B', 'x', 10, 2), make(3, 'C', 'x', 5, 3)];
    expect(ids(sortProducts(same, 'price-asc'))).toEqual([3, 1, 2]);
    expect(ids(sortProducts(same, 'price-desc'))).toEqual([1, 2, 3]);
  });

  it('returns an empty array for an empty input', () => {
    expect(sortProducts([], 'price-asc')).toEqual([]);
  });

  it('does not mutate the input', () => {
    const copy = structuredClone(products);
    sortProducts(products, 'price-desc');
    sortProducts(products, 'rating-desc');
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

  it('reads a known sort mode', () => {
    expect(parseFilters(new URLSearchParams('sort=price-asc'))).toEqual({ sort: 'price-asc' });
  });

  it('ignores an unknown sort mode and the default one', () => {
    expect(parseFilters(new URLSearchParams('sort=abc'))).toEqual({});
    expect(parseFilters(new URLSearchParams('sort=default'))).toEqual({});
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

  it('writes the sort mode, but not the default one', () => {
    expect(filtersToParams({ sort: 'rating-desc' }).toString()).toBe('sort=rating-desc');
    expect(filtersToParams({ sort: 'default' }).toString()).toBe('');
  });

  it('round trip: filters to params and back', () => {
    const filters = {
      query: 'smart phone',
      category: 'electronics',
      min: 5,
      max: 600,
      minRating: 4.5,
      sort: 'price-desc' as const,
    };
    expect(parseFilters(filtersToParams(filters))).toEqual(filters);
  });
});

describe('page in the URL', () => {
  it('reads a page number and ignores wrong ones and page 1', () => {
    expect(parseFilters(new URLSearchParams('page=3'))).toEqual({ page: 3 });
    expect(parseFilters(new URLSearchParams('page=1'))).toEqual({});
    expect(parseFilters(new URLSearchParams('page=0'))).toEqual({});
    expect(parseFilters(new URLSearchParams('page=-2'))).toEqual({});
    expect(parseFilters(new URLSearchParams('page=abc'))).toEqual({});
    expect(parseFilters(new URLSearchParams('page=2.5'))).toEqual({});
  });

  it('writes the page only when it is greater than 1', () => {
    expect(filtersToParams({ page: 2 }).toString()).toBe('page=2');
    expect(filtersToParams({ page: 1 }).toString()).toBe('');
  });

  it('round trip with a page', () => {
    const filters = { category: 'books', sort: 'price-asc' as const, page: 4 };
    expect(parseFilters(filtersToParams(filters))).toEqual(filters);
  });

  it('filterProducts ignores the page', () => {
    expect(filterProducts(products, { page: 5 })).toEqual(products);
  });
});

describe('getPageCount', () => {
  it('rounds up and never gives less than 1 page', () => {
    expect(getPageCount(30, 6)).toBe(5);
    expect(getPageCount(31, 6)).toBe(6);
    expect(getPageCount(0, 6)).toBe(1);
  });
});

describe('clampPage', () => {
  it('keeps a page inside 1..pageCount', () => {
    expect(clampPage(3, 5)).toBe(3);
    expect(clampPage(9, 5)).toBe(5);
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(-4, 5)).toBe(1);
    expect(clampPage(Number.NaN, 5)).toBe(1);
  });
});

describe('paginate', () => {
  const list = [1, 2, 3, 4, 5, 6, 7];

  it('returns the items of the page', () => {
    expect(paginate(list, 1, 3)).toEqual([1, 2, 3]);
    expect(paginate(list, 2, 3)).toEqual([4, 5, 6]);
    expect(paginate(list, 3, 3)).toEqual([7]);
  });

  it('moves a wrong page to the nearest real one', () => {
    expect(paginate(list, 99, 3)).toEqual([7]);
    expect(paginate(list, 0, 3)).toEqual([1, 2, 3]);
  });

  it('returns an empty array for an empty input and does not mutate', () => {
    expect(paginate([], 1, 3)).toEqual([]);
    const copy = [...list];
    paginate(list, 2, 3);
    expect(list).toEqual(copy);
  });
});

describe('getPageItems', () => {
  it('shows every page when there are few', () => {
    expect(getPageItems(1, 1)).toEqual([1]);
    expect(getPageItems(3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageItems(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('cuts the end with dots near the start', () => {
    expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(getPageItems(4, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
  });

  it('cuts both sides in the middle', () => {
    expect(getPageItems(5, 20)).toEqual([1, 'gap', 4, 5, 6, 'gap', 20]);
    expect(getPageItems(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
  });

  it('cuts the start with dots near the end', () => {
    expect(getPageItems(17, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
    expect(getPageItems(20, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
  });
});

describe('countActiveFilters', () => {
  it('counts only the set filters', () => {
    expect(countActiveFilters({})).toBe(0);
    expect(countActiveFilters({ category: 'books', min: 0, sort: 'price-asc' })).toBe(3);
  });

  it('does not count defaults, the search text and the page', () => {
    expect(
      countActiveFilters({ category: 'all', minRating: 0, sort: 'default', query: 'a', page: 3 }),
    ).toBe(0);
  });
});
