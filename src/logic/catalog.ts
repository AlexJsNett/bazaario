// Pure functions for the catalog: search and filters. They return new arrays and never
// mutate the input. Filters live in the URL query, see parseFilters and filtersToParams.

import type { Product } from '../types/product';

export type SortMode = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

const SORT_MODES: SortMode[] = ['default', 'price-asc', 'price-desc', 'rating-desc'];

export type Filters = {
  query?: string;
  /** 'all' or missing means every category */
  category?: string;
  min?: number;
  max?: number;
  minRating?: number;
  /** not a filter, but part of the catalog state in the URL. filterProducts ignores it */
  sort?: SortMode;
  /** page number from 1. Not a filter either: filterProducts ignores it */
  page?: number;
};

export const ALL_CATEGORIES = 'all';

// Unique category names, sorted by name. Used for the category menu.
export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.category))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function searchProducts(products: Product[], query: string): Product[] {
  const text = query.trim().toLowerCase();
  if (text === '') {
    return [...products];
  }
  return products.filter((product) => product.title.toLowerCase().includes(text));
}

export function filterByCategory(products: Product[], category: string): Product[] {
  if (category === ALL_CATEGORIES) {
    return [...products];
  }
  return products.filter((product) => product.category === category);
}

// Bounds are inclusive. A missing bound is ignored.
export function filterByPrice(products: Product[], min?: number, max?: number): Product[] {
  return products.filter(
    (product) =>
      (min === undefined || product.price >= min) && (max === undefined || product.price <= max),
  );
}

export function filterByRating(products: Product[], minRating: number): Product[] {
  return products.filter((product) => product.rating >= minRating);
}

export function filterProducts(products: Product[], filters: Filters = {}): Product[] {
  const { query = '', category = ALL_CATEGORIES, min, max, minRating = 0 } = filters;
  const found = searchProducts(products, query);
  const inCategory = filterByCategory(found, category);
  const inPrice = filterByPrice(inCategory, min, max);
  return filterByRating(inPrice, minRating);
}

// Returns a new array. Array.sort is stable, so equal values keep the original order.
export function sortProducts(products: Product[], mode: SortMode): Product[] {
  const sorted = [...products];
  switch (mode) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

// A number from the URL: empty, text and negative values are ignored.
function readNumber(params: URLSearchParams, name: string): number | undefined {
  const raw = params.get(name);
  if (raw === null || raw.trim() === '') {
    return undefined;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}

export function parseFilters(params: URLSearchParams): Filters {
  const filters: Filters = {};
  const query = params.get('query')?.trim();
  if (query) {
    filters.query = query;
  }
  const category = params.get('category')?.trim();
  if (category) {
    filters.category = category;
  }
  const min = readNumber(params, 'min');
  if (min !== undefined) {
    filters.min = min;
  }
  const max = readNumber(params, 'max');
  if (max !== undefined) {
    filters.max = max;
  }
  const minRating = readNumber(params, 'minRating');
  if (minRating !== undefined) {
    filters.minRating = minRating;
  }
  const sort = params.get('sort');
  if (sort && sort !== 'default' && SORT_MODES.includes(sort as SortMode)) {
    filters.sort = sort as SortMode;
  }
  const page = Number(params.get('page'));
  if (Number.isInteger(page) && page > 1) {
    filters.page = page;
  }
  return filters;
}

// Empty and default fields are not written, so the address stays short.
export function filtersToParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  const query = filters.query?.trim();
  if (query) {
    params.set('query', query);
  }
  if (filters.category && filters.category !== ALL_CATEGORIES) {
    params.set('category', filters.category);
  }
  for (const name of ['min', 'max', 'minRating'] as const) {
    const value = filters[name];
    if (value !== undefined && Number.isFinite(value)) {
      params.set(name, String(value));
    }
  }
  if (filters.sort && filters.sort !== 'default') {
    params.set('sort', filters.sort);
  }
  if (filters.page !== undefined && Number.isInteger(filters.page) && filters.page > 1) {
    params.set('page', String(filters.page));
  }
  return params;
}

// How many filters are set, for the "Show filters (2)" button. The page and the search text
// are not counted: the search field has its own place in the header.
export function countActiveFilters(filters: Filters): number {
  const checks = [
    filters.category !== undefined && filters.category !== ALL_CATEGORIES,
    filters.min !== undefined,
    filters.max !== undefined,
    filters.minRating !== undefined && filters.minRating > 0,
    filters.sort !== undefined && filters.sort !== 'default',
  ];
  return checks.filter(Boolean).length;
}

export type PageItem = number | 'gap';

export function getPageCount(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(total / perPage));
}

// A page number outside the range is moved to the nearest real page.
export function clampPage(page: number, pageCount: number): number {
  return Math.min(Math.max(1, Math.trunc(page) || 1), pageCount);
}

// One page of the list. Returns a new array and never mutates the input.
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const current = clampPage(page, getPageCount(items.length, perPage));
  return items.slice((current - 1) * perPage, current * perPage);
}

// Buttons for the pager: the first and the last page are always there, the middle is cut
// with a 'gap' (the dots). The list keeps the same length while the user moves:
// 1 2 3 4 5 ... 20  /  1 ... 8 9 10 ... 20  /  1 ... 16 17 18 19 20
export function getPageItems(current: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'gap', pageCount];
  }
  if (current >= pageCount - 3) {
    return [1, 'gap', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, 'gap', current - 1, current, current + 1, 'gap', pageCount];
}
