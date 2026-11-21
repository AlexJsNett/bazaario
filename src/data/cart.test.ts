import { describe, it, expect } from 'vitest';
import type { Cart } from '../types/cart.ts';
import { getCartCount, addToCart, removeFromCart, changeQuantity } from './cart.ts';

const makeCart = (): Cart => {
  return {
    products: [
      { productId: 1, quantity: 10 },
      { productId: 2, quantity: 2 },
      { productId: 4, quantity: 4 },
    ],
  };
};

describe('cart', () => {
  describe('getCartCount', () => {
    it('should count total amount correctly', () => {
      expect(getCartCount(makeCart())).toBe(16);
    });

    it('should return 0 for an empty cart', () => {
      expect(getCartCount({ products: [] })).toBe(0);
    });

    it('should not mutate the input', () => {
      const cart = makeCart();

      getCartCount(cart);

      expect(cart).toEqual(makeCart());
    });
  });

  describe('addToCart', () => {
    it('should increase quantity of a product already in the cart', () => {
      const result = addToCart(makeCart(), 1);

      expect(result.products.find((p) => p.productId === 1)?.quantity).toBe(11);
      expect(result.products).toHaveLength(3);
    });

    it('should add a new product with quantity 1', () => {
      const result = addToCart(makeCart(), 99);

      expect(result.products).toHaveLength(4);
      expect(result.products).toContainEqual({ productId: 99, quantity: 1 });
    });

    it('should add to an empty cart', () => {
      expect(addToCart({ products: [] }, 5)).toEqual({
        products: [{ productId: 5, quantity: 1 }],
      });
    });

    it('should not mutate the input', () => {
      const cart = makeCart();

      addToCart(cart, 1);
      addToCart(cart, 99);

      expect(cart).toEqual(makeCart());
    });
  });

  describe('removeFromCart', () => {
    it('should remove the product from the cart', () => {
      const result = removeFromCart(makeCart(), 2);

      expect(result.products.map((p) => p.productId)).toEqual([1, 4]);
    });

    it('should leave the cart unchanged when the product is absent', () => {
      expect(removeFromCart(makeCart(), 99)).toEqual(makeCart());
    });

    it('should not mutate the input', () => {
      const cart = makeCart();

      removeFromCart(cart, 2);

      expect(cart).toEqual(makeCart());
    });
  });

  describe('changeQuantity', () => {
    it('should increase quantity by a positive delta', () => {
      const result = changeQuantity(makeCart(), 2, 3);

      expect(result.products.find((p) => p.productId === 2)?.quantity).toBe(5);
    });

    it('should decrease quantity by a negative delta', () => {
      const result = changeQuantity(makeCart(), 1, -4);

      expect(result.products.find((p) => p.productId === 1)?.quantity).toBe(6);
    });

    it('should leave the cart unchanged when the product is absent', () => {
      expect(changeQuantity(makeCart(), 99, 1)).toEqual(makeCart());
    });

    it('should not mutate the input', () => {
      const cart = makeCart();

      changeQuantity(cart, 1, 5);

      expect(cart).toEqual(makeCart());
    });
  });
});
