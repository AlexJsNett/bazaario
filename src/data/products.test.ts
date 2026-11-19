import { afterEach, describe, expect, it, vi } from 'vitest';
import rawProducts from '../../public/api/products.json';
import { loadProducts } from './products';

const products: Record<string, unknown>[] = rawProducts;

describe('public/api/products.json', () => {
  it('has at least 24 products', () => {
    expect(products.length).toBeGreaterThanOrEqual(24);
  });

  it('has at least 6 categories', () => {
    expect(new Set(products.map((p) => p.category)).size).toBeGreaterThanOrEqual(6);
  });

  it('has unique ids', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });

  it('has all required fields with correct types', () => {
    for (const p of products) {
      expect(typeof p.id).toBe('number');
      for (const key of ['title', 'category', 'image', 'description']) {
        expect(typeof p[key], `${key} of product ${p.id}`).toBe('string');
        expect((p[key] as string).length, `${key} of product ${p.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('has price > 0 and rating from 0 to 5', () => {
    for (const p of products) {
      expect(p.price as number, `price of product ${p.id}`).toBeGreaterThan(0);
      expect(p.rating as number, `rating of product ${p.id}`).toBeGreaterThanOrEqual(0);
      expect(p.rating as number, `rating of product ${p.id}`).toBeLessThanOrEqual(5);
    }
  });

  it('has oldPrice higher than price when present', () => {
    for (const p of products.filter((item) => item.oldPrice !== undefined)) {
      expect(p.oldPrice as number, `oldPrice of product ${p.id}`).toBeGreaterThan(
        p.price as number,
      );
    }
  });
});

describe('loadProducts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns products for a good response and uses the base url', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(rawProducts),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await loadProducts();

    expect(result).toEqual(rawProducts);
    expect(fetchMock).toHaveBeenCalledWith(import.meta.env.BASE_URL + 'api/products.json');
  });

  it('throws a clear error for a bad response status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' }),
    );

    await expect(loadProducts()).rejects.toThrow(/Failed to load products.*404 Not Found/);
  });
});
