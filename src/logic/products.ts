import type { Product, ProductId } from '@/types/product';

export const getProductById = (products: Product[], id: ProductId): Product | undefined =>
  products.find((product) => product.id === id);
