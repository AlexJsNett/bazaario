import './cart.scss';
import type { Cart } from '../../types/cart';
import type { Product } from '../../types/product';
import { el } from '../../utils/dom';
import { calculateTotal, getCartCount } from '../../logic/cart';
import { getProductById } from '../../logic/products';
import { createCartList } from '../cart-list/cart-list';
import type { CartItemOptions } from '../cart-item/cart-item';
import { createPrice } from '../price/price';

export type CartOptions = {
  products: Product[];
  cart: Cart;
  reviewsCount?: Record<number, number>;
  onIncrease: (product: Product) => void;
  onDecrease: (product: Product) => void;
  onRemove: (product: Product) => void;
};

const getItems = (options: CartOptions): CartItemOptions[] => {
  const { products, cart, reviewsCount = {}, onIncrease, onDecrease, onRemove } = options;
  return cart.products.flatMap((item) => {
    const product = getProductById(products, item.productId);
    if (!product) {
      return [];
    }
    return [
      {
        product,
        quantity: item.quantity,
        reviewsCount: reviewsCount[product.id],
        onIncrease,
        onDecrease,
        onRemove,
      },
    ];
  });
};

export const createCart = (options: CartOptions): HTMLElement => {
  const { products, cart } = options;

  const root = el('section', 'cart');
  root.append(el('h2', 'cart__title', 'Shopping cart'));

  const items = getItems(options);
  if (items.length === 0) {
    root.append(el('p', 'cart__empty', 'Your cart is empty'));
    return root;
  }

  const footer = el('div', 'cart__subtotal');
  footer.append(
    el('span', 'cart__subtotal-label', `Subtotal (${getCartCount(cart)} items):`),
    createPrice({ price: calculateTotal(products, [], cart).total }),
  );

  root.append(createCartList({ items }), footer);
  return root;
};
