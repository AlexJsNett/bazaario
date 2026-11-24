import './product-card.scss';
import type { Product } from '@/types/product';
import { el } from '@/utils/dom';
import { createButton } from '@/components/button/button';
import { createFavoriteButton } from '@/components/favorite-button/favorite-button';
import { createPrice } from '@/components/price/price';
import { createQuantityStepper } from '@/components/quantity-stepper/quantity-stepper';
import { createRating } from '@/components/rating/rating';

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
  /** address of the product page: the image and the title become links */
  href?: string;
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
    href,
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

  const title = el('h3', 'product-card__title');
  if (href) {
    const link = el('a', 'product-card__link', product.title);
    link.href = href;
    title.append(link);
    const imageLink = el('a', 'product-card__image-link');
    imageLink.href = href;
    imageLink.tabIndex = -1;
    imageLink.setAttribute('aria-hidden', 'true');
    imageLink.append(image);
    card.append(imageLink);
  } else {
    title.textContent = product.title;
    card.append(image);
  }

  card.append(
    favorite,
    title,
    createRating({ score: product.rating, reviewsCount }),
    createPrice({ price: product.price, oldPrice: product.oldPrice }),
    cartControl,
  );
  return card;
};
