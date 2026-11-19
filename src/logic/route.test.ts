import { describe, expect, it } from 'vitest';
import { buildHash, parseHash } from './route.ts';

describe('parseHash', () => {
  it('parses path and query', () => {
    const { path, query } = parseHash('#/catalog?query=phone&category=books');
    expect(path).toBe('catalog');
    expect(query.get('query')).toBe('phone');
    expect(query.get('category')).toBe('books');
  });

  it('accepts a hash without the leading slash', () => {
    expect(parseHash('#catalog').path).toBe('catalog');
  });

  it('handles an empty hash and a bare #', () => {
    expect(parseHash('').path).toBe('');
    expect(parseHash('#').path).toBe('');
    expect(parseHash('#').query.size).toBe(0);
  });

  it('ignores a trailing slash and an empty query', () => {
    expect(parseHash('#/cart/').path).toBe('cart');
    expect(parseHash('#/cart?').query.size).toBe(0);
  });

  it('decodes encoded values and keeps a "?" inside the value', () => {
    const { query } = parseHash('#/catalog?query=red%20shoes&q=a?b');
    expect(query.get('query')).toBe('red shoes');
    expect(query.get('q')).toBe('a?b');
  });
});

describe('buildHash', () => {
  it('builds a hash without query', () => {
    expect(buildHash('cart')).toBe('#/cart');
    expect(buildHash('cart', {})).toBe('#/cart');
  });

  it('encodes the query', () => {
    expect(buildHash('catalog', { query: 'red shoes', category: 'books' })).toBe(
      '#/catalog?query=red+shoes&category=books',
    );
  });
});
