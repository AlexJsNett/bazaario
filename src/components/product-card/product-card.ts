import './product-card.scss';
import type { Product } from '../../types/product';
import { el } from '../../utils/dom';
import { createButton } from '../button/button';
import { createFavoriteButton } from '../favorite-button/favorite-button';
import { createPrice } from '../price/price';
import { createRating } from '../rating/rating';

export type ProductCardOptions = {
  product: Product;
  isFavorite: boolean;
  reviewsCount?: number;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
};

export const createProductCard = (options: ProductCardOptions): HTMLElement => {
  const { product, isFavorite, reviewsCount = 0, onAddToCart, onToggleFavorite } = options;

  const card = el('article', 'product-card');

  const image = el('img', 'product-card__image');
  image.src = `${import.meta.env.BASE_URL}${product.image}`;
  image.alt = product.title;
  image.loading = 'lazy';

  const favorite = createFavoriteButton({
    active: isFavorite,
    onToggle: () => onToggleFavorite(product),
  });
  favorite.classList.add('product-card__favorite');

  const addToCart = createButton({
    label: 'Add to cart',
    variant: 'primary',
    onClick: () => onAddToCart(product),
  });
  addToCart.classList.add('product-card__button');

  card.append(
    image,
    favorite,
    el('h3', 'product-card__title', product.title),
    createRating({ score: product.rating, reviewsCount }),
    createPrice({ price: product.price, oldPrice: product.oldPrice }),
    addToCart,
  );
  return card;
};
