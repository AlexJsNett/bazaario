import type { ProductId } from './product';

export type CartItem = { productId: ProductId; quantity: number };

export type Cart = {
  products: CartItem[];
};
