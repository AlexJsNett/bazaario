import type { Product, ProductId } from '@/types/product';

export const getProductById = (products: Product[], id: ProductId): Product | undefined =>
  products.find((product) => product.id === id);

/**
 * Products to show under a product: the same category first (best rating first),
 * then the best of other categories if there are fewer than `limit`.
 * The product itself is never in the list.
 */
export const getRecommendations = (products: Product[], product: Product, limit = 4): Product[] => {
  const byRating = (a: Product, b: Product): number => b.rating - a.rating;
  const others = products.filter((item) => item.id !== product.id);
  const same = others.filter((item) => item.category === product.category).sort(byRating);
  const rest = others.filter((item) => item.category !== product.category).sort(byRating);
  return [...same, ...rest].slice(0, Math.max(0, limit));
};

export const getProductsByIds = (products: Product[], ids: ProductId[]): Product[] =>
  ids.flatMap((id) => {
    const product = getProductById(products, id);
    return product ? [product] : [];
  });
