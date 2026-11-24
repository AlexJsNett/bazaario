import './product-row.scss';
import type { Product, ProductId } from '@/types/product';
import { el } from '@/utils/dom';
import { buildHash } from '@/logic/route';
import { createProductCard } from '@/components/product-card/product-card';

export type ProductRowOptions = {
  title: string;
  products: Product[];
  favorites: ProductId[];
  /** how many of each product are in the cart, by product id */
  quantities?: Record<number, number>;
  reviewsCount?: Record<number, number>;
  onAddToCart: (product: Product) => void;
  onDecrease?: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
};

/** A titled row of product cards: scrolls sideways on a phone, a grid on a desktop. */
export const createProductRow = (options: ProductRowOptions): HTMLElement => {
  const {
    title,
    products,
    favorites,
    quantities = {},
    reviewsCount = {},
    onAddToCart,
    onDecrease,
    onToggleFavorite,
  } = options;

  const section = el('section', 'product-row');
  section.append(el('h2', 'product-row__title', title));

  const list = el('div', 'product-row__list');
  for (const product of products) {
    const item = el('div', 'product-row__item');
    item.append(
      createProductCard({
        product,
        isFavorite: favorites.includes(product.id),
        reviewsCount: reviewsCount[product.id],
        quantity: quantities[product.id],
        onAddToCart,
        onDecrease,
        onToggleFavorite,
        href: buildHash('product', { id: String(product.id) }),
      }),
    );
    list.append(item);
  }
  section.append(list);
  return section;
};
