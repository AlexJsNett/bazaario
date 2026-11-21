import type { ProductId } from './product';

export type Review = {
  productId: ProductId;
  count: number;
};
