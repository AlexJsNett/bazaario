import { el } from '../../utils/dom.ts';
import { updateUser } from '../../store/user.ts';
import { addToCart } from '../../logic/cart.ts';
import type { ProductId } from '../../types/product.ts';

const addProductToCart = (productId: ProductId): void => {
  updateUser((user) => ({ ...user, cart: addToCart(user.cart, productId) }));
};

export const render = () => {
  const rootEl = document.createElement('div');
  rootEl.textContent = 'this is catalog page';
  /* todo: remove fake button to test cart page */
  const productId = 1;
  const addItem = el('button', '', `Add product with id ${productId}`);
  addItem.addEventListener('click', () => addProductToCart(productId));
  rootEl.append(addItem);
  return rootEl;
};
