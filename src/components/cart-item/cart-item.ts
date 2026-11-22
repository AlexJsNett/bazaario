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

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

const createCell = (className: string, label: string, content: HTMLElement): HTMLDivElement => {
  const cell = el('div', className);
  cell.append(el('span', 'cart-item__label', label), content);
  return cell;
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

  const info = el('div', 'cart-item__info');
  info.append(
    el('h3', 'cart-item__title', product.title),
    el('span', 'cart-item__category', product.category),
    createRating({ score: product.rating, reviewsCount }),
    remove,
  );

  const stepper = createQuantityStepper({
    quantity,
    onIncrease: () => onIncrease(product),
    onDecrease: () => onDecrease(product),
  });

  item.append(
    image,
    info,
    createCell(
      'cart-item__unit-price',
      'Price',
      createPrice({ price: product.price, oldPrice: product.oldPrice }),
    ),
    createCell('cart-item__quantity', 'Quantity', stepper),
    createCell(
      'cart-item__total',
      'Total',
      createPrice({ price: roundToCents(product.price * quantity) }),
    ),
  );
  return item;
};
