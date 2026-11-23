import './product-grid.scss';
import type { Product, ProductId } from '../../types/product';
import { el } from '../../utils/dom';
import { createButton } from '../button/button';
import { createProductCard } from '../product-card/product-card';

export type ProductGridOptions = {
  products: Product[];
  favorites: ProductId[];
  reviewsCount?: Record<number, number>;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  /** shown on the "nothing found" message */
  onReset?: () => void;
  /** fade the cards in, for a list that has just changed */
  animated?: boolean;
};

export const createProductGrid = (options: ProductGridOptions): HTMLElement => {
  const {
    products,
    favorites,
    reviewsCount = {},
    onAddToCart,
    onToggleFavorite,
    onReset,
    animated,
  } = options;

  if (products.length === 0) {
    const empty = el('section', 'product-grid__empty');
    empty.append(
      el('h2', 'product-grid__empty-title', 'Nothing found'),
      el('p', 'product-grid__empty-text', 'Try another search or change the filters.'),
    );
    if (onReset) {
      empty.append(createButton({ label: 'Reset filters', onClick: onReset }));
    }
    return empty;
  }

  const grid = el('div', 'product-grid');
  grid.classList.toggle('product-grid--animated', Boolean(animated));
  for (const product of products) {
    grid.append(
      createProductCard({
        product,
        isFavorite: favorites.includes(product.id),
        reviewsCount: reviewsCount[product.id],
        onAddToCart,
        onToggleFavorite,
      }),
    );
  }
  return grid;
};
