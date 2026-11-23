import './product-card.scss';
import type { Product } from '../../types/product';
import { el } from '../../utils/dom';
import { createButton } from '../button/button';
import { createFavoriteButton } from '../favorite-button/favorite-button';
import { createPrice } from '../price/price';
import { createQuantityStepper } from '../quantity-stepper/quantity-stepper';
import { createRating } from '../rating/rating';

export type ProductCardOptions = {
  product: Product;
  isFavorite: boolean;
  reviewsCount?: number;
  /** how many of this product are in the cart. More than 0 replaces the button with a stepper */
  quantity?: number;
  /** adds one, also used by the "+" of the stepper */
  onAddToCart: (product: Product) => void;
  /** takes one away, the product leaves the cart at 0 */
  onDecrease?: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
};

export const createProductCard = (options: ProductCardOptions): HTMLElement => {
  const {
    product,
    isFavorite,
    reviewsCount = 0,
    quantity = 0,
    onAddToCart,
    onDecrease,
    onToggleFavorite,
  } = options;

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

  // Once the product is in the cart, the button turns into a stepper: "−", the count, "+".
  let cartControl: HTMLElement;
  if (quantity > 0 && onDecrease) {
    cartControl = createQuantityStepper({
      quantity,
      min: 0,
      onIncrease: () => onAddToCart(product),
      onDecrease: () => onDecrease(product),
    });
    cartControl.classList.add('product-card__stepper');
  } else {
    cartControl = createButton({
      label: 'Add to cart',
      variant: 'primary',
      onClick: () => onAddToCart(product),
    });
    cartControl.classList.add('product-card__button');
  }

  card.append(
    image,
    favorite,
    el('h3', 'product-card__title', product.title),
    createRating({ score: product.rating, reviewsCount }),
    createPrice({ price: product.price, oldPrice: product.oldPrice }),
    cartControl,
  );
  return card;
};
