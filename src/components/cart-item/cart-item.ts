import './cart-item.scss';
import type { Product } from '../../types/product';
import { el } from '../../utils/dom';
import { createPrice } from '../price/price';
import { createRating } from '../rating/rating';
import { createQuantityStepper } from '../quantity-stepper/quantity-stepper';

export type CartItemOptions = {
  product: Product;
  quantity: number;
  reviewsCount?: number;
  onIncrease: (product: Product) => void;
  onDecrease: (product: Product) => void;
  onRemove: (product: Product) => void;
};

export const createCartItem = (options: CartItemOptions): HTMLLIElement => {
  const { product, quantity, reviewsCount = 0, onIncrease, onDecrease, onRemove } = options;

  const item = el('li', 'cart-item');

  const image = el('img', 'cart-item__image');
  image.src = `${import.meta.env.BASE_URL}${product.image}`;
  image.alt = product.title;
  image.loading = 'lazy';

  const remove = el('button', 'cart-item__remove', 'Remove');
  remove.type = 'button';
  remove.addEventListener('click', () => onRemove(product));

  const actions = el('div', 'cart-item__actions');
  actions.append(
    createQuantityStepper({
      quantity,
      onIncrease: () => onIncrease(product),
      onDecrease: () => onDecrease(product),
    }),
    remove,
  );

  const info = el('div', 'cart-item__info');
  info.append(
    el('h3', 'cart-item__title', product.title),
    el('span', 'cart-item__category', product.category),
    createRating({ score: product.rating, reviewsCount }),
    actions,
  );

  const priceBox = el('div', 'cart-item__price');
  priceBox.append(createPrice({ price: product.price, oldPrice: product.oldPrice }));

  item.append(image, info, priceBox);
  return item;
};
