import { describe, it, expect } from 'vitest';
import {
  addToCart,
  calculateTotal,
  changeQuantity,
  decreaseInCart,
  findPromoCode,
  getCartCount,
  getCartProductsCount,
  getQuantity,
  removeFromCart,
} from './cart';
import type { Cart, PromoCode } from '../types/cart.ts';
import type { Product } from '../types/product.ts';

const makeProduct = (id: number, price: number): Product => ({
  id,
  title: `product ${id}`,
  category: 'test',
  price,
  rating: 4,
  image: 'images/test.jpg',
  description: 'description',
});

const makePromos = (): PromoCode[] => [
  { code: 'SALE10', discount: 10 },
  { code: 'HALF', discount: 50 },
  { code: 'BROKEN', discount: 150 },
];

const makeProducts = (): Product[] => [
  makeProduct(1, 10),
  makeProduct(2, 25.5),
  makeProduct(4, 100),
];

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

  describe('getCartProductsCount', () => {
    it('should count different products, not the quantities', () => {
      expect(getCartProductsCount(makeCart())).toBe(3);
    });

    it('should return 0 for an empty cart', () => {
      expect(getCartProductsCount({ products: [] })).toBe(0);
    });
  });

  describe('decreaseInCart', () => {
    it('should decrease the quantity by 1', () => {
      const result = decreaseInCart(makeCart(), 1);

      expect(getQuantity(result, 1)).toBe(9);
    });

    it('should remove the product when the quantity was 1', () => {
      const cart: Cart = { products: [{ productId: 3, quantity: 1 }] };

      expect(decreaseInCart(cart, 3).products).toEqual([]);
    });

    it('should return the same cart for a product that is not in it', () => {
      const cart = makeCart();

      expect(decreaseInCart(cart, 99)).toEqual(makeCart());
    });

    it('should not mutate the cart', () => {
      const cart = makeCart();
      decreaseInCart(cart, 2);

      expect(cart).toEqual(makeCart());
    });
  });

  describe('getQuantity', () => {
    it('should return the quantity of a product in the cart', () => {
      expect(getQuantity(makeCart(), 2)).toBe(2);
    });

    it('should return 0 for a product that is not in the cart', () => {
      expect(getQuantity(makeCart(), 99)).toBe(0);
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

    it('should not decrease quantity below 1', () => {
      const result = changeQuantity(makeCart(), 1, -444);

      expect(result.products.find((p) => p.productId === 1)?.quantity).toBe(1);
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

  describe('findPromoCode', () => {
    it('should find a code ignoring case and surrounding spaces', () => {
      expect(findPromoCode(makePromos(), '  sale10 ')?.discount).toBe(10);
    });

    it('should return undefined for an unknown code', () => {
      expect(findPromoCode(makePromos(), 'nope')).toBeUndefined();
    });
  });

  describe('calculateTotal', () => {
    // makeCart: 10 x 10 + 2 x 25.5 + 4 x 100 = 551
    const expectedTotal = 551;

    it('should multiply price by quantity', () => {
      const result = calculateTotal(makeProducts(), makePromos(), makeCart());

      expect(result).toEqual({ total: expectedTotal, discount: 0, subtotal: expectedTotal });
    });

    it('should return zeros for an empty cart', () => {
      expect(calculateTotal(makeProducts(), makePromos(), { products: [] })).toEqual({
        total: 0,
        discount: 0,
        subtotal: 0,
      });
    });

    it('should skip products missing from the catalog', () => {
      const cart = {
        products: [
          { productId: 999, quantity: 3 },
          { productId: 1, quantity: 2 },
        ],
      };

      expect(calculateTotal(makeProducts(), makePromos(), cart).total).toBe(20);
    });

    it('should apply a percent promo code', () => {
      const result = calculateTotal(makeProducts(), makePromos(), makeCart(), 'sale10');

      expect(result.subtotal).toBe(expectedTotal);
      expect(result.discount).toBe(55.1);
      expect(result.total).toBe(495.9);
    });

    it('should match the promo code case-insensitively', () => {
      const result = calculateTotal(makeProducts(), makePromos(), makeCart(), ' half ');

      expect(result.discount).toBe(expectedTotal / 2);
      expect(result.total).toBe(expectedTotal / 2);
    });

    it('should ignore an unknown or empty promo code', () => {
      const unknown = calculateTotal(makeProducts(), makePromos(), makeCart(), 'nope');
      const empty = calculateTotal(makeProducts(), makePromos(), makeCart(), '');

      expect(unknown.discount).toBe(0);
      expect(empty.discount).toBe(0);
      expect(unknown.total).toBe(expectedTotal);
    });

    it('should clamp a discount above 100 percent so subtotal is never negative', () => {
      const result = calculateTotal(makeProducts(), makePromos(), makeCart(), 'BROKEN');

      expect(result.discount).toBe(expectedTotal);
      expect(result.total).toBe(0);
    });

    it('should round to cents', () => {
      const products = [makeProduct(1, 0.1), makeProduct(2, 0.2)];
      const cart = {
        products: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 1 },
        ],
      };

      expect(calculateTotal(products, [], cart).total).toBe(0.3);
    });

    it('should not mutate the inputs', () => {
      const products = makeProducts();
      const promos = makePromos();
      const cart = makeCart();

      calculateTotal(products, promos, cart, 'sale10');

      expect(products).toEqual(makeProducts());
      expect(promos).toEqual(makePromos());
      expect(cart).toEqual(makeCart());
    });
  });
});
