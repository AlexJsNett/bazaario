import type { ProductId } from './product';

export type ReviewItem = {
  author: string;
  /** from 1 to 5 */
  rating: number;
  /** 'YYYY-MM-DD' */
  date: string;
  title: string;
  text: string;
};

export type Review = {
  productId: ProductId;
  count: number;
  /** a few example reviews, shown on the product page */
  items?: ReviewItem[];
};
