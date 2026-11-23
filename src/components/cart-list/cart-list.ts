import './cart-list.scss';
import { el } from '@/utils/dom';
import { createCartItem, type CartItemOptions } from '@/components/cart-item/cart-item';

export type CartListOptions = {
  items: CartItemOptions[];
};

export const createCartList = (options: CartListOptions): HTMLUListElement => {
  const list = el('ul', 'cart-list');
  list.append(...options.items.map(createCartItem));
  return list;
};
