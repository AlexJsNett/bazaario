import type { Cart } from '../types/cart.ts';
import type { ProductId } from '../types/product.ts';

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
