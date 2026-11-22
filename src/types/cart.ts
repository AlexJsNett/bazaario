import type { ProductId } from './product';

export type CartItem = { productId: ProductId; quantity: number };

export type Cart = {
  products: CartItem[];
};

export type PromoCode = {
  code: string;
  discount: number; // in percent 0 - 100
};

export type CartPrice = {
  subtotal: number;
  discount: number;
  total: number;
};
