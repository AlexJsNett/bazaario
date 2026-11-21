import type { Cart, CartPrice, PromoCode } from '../types/cart.ts';
import type { Product, ProductId } from '../types/product.ts';
import { getProductById } from '../logic/products.ts';

export const addToCart = (cart: Cart, productId: ProductId): Cart => {
  const cartCopy = structuredClone(cart);
  const cartItem = cartCopy.products.find((product) => product.productId === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cartCopy.products.push({ productId, quantity: 1 });
  }

  return cartCopy;
};

export const removeFromCart = (cart: Cart, productId: ProductId): Cart => {
  return {
    ...cart,
    products: cart.products.filter((p) => p.productId !== productId),
  };
};

export const changeQuantity = (cart: Cart, productId: ProductId, delta: number): Cart => {
  const cartCopy = structuredClone(cart);
  const cartItem = cartCopy.products.find((product) => product.productId === productId);
  if (cartItem) {
    cartItem.quantity += delta;
  }
  return cartCopy;
};

export const getCartCount = (cart: Cart): number => {
  return cart.products.reduce((acc, ci) => acc + ci.quantity, 0);
};

export const findPromoCode = (promos: PromoCode[], code: string) => {
  return promos.find((p) => p.code.trim().toLowerCase() === code.trim().toLowerCase());
};

const roundToCents = (value: number): number => Math.round(value * 100) / 100;

export const calculateTotal = (
  products: Product[],
  promos: PromoCode[],
  cart: Cart,
  promoCode?: string,
): CartPrice => {
  const total = roundToCents(
    cart.products.reduce((acc, item) => {
      const product = getProductById(products, item.productId);
      return product ? acc + product.price * item.quantity : acc;
    }, 0),
  );

  let discount = 0;
  if (promoCode) {
    const activeCode = findPromoCode(promos, promoCode);
    if (activeCode) {
      const percent = Math.min(Math.max(activeCode.discount, 0), 100);
      discount = roundToCents(total * (percent / 100));
    }
  }

  return {
    total,
    discount,
    subtotal: roundToCents(total - discount),
  };
};
