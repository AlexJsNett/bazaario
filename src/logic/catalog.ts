// Pure functions for the catalog: search and filters. They return new arrays and never
// mutate the input. Filters live in the URL query, see parseFilters and filtersToParams.

import type { Product } from '../types/product';

export type Filters = {
  query?: string;
  /** 'all' or missing means every category */
  category?: string;
  min?: number;
  max?: number;
  minRating?: number;
};

export const ALL_CATEGORIES = 'all';

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
  return params;
}
