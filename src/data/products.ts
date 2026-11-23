import type { Product } from '@/types/product';

const PRODUCTS_URL = 'api/products.json';

export const loadProducts = async (): Promise<Product[]> => {
  const url = import.meta.env.BASE_URL + PRODUCTS_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to load products from ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
};
