import type { Review } from '@/types/reviews.ts';
import type { ProductId } from '@/types/product.ts';

export const getReviews = (reviews: Review[], productId: ProductId): number => {
  return reviews.find((review) => review.productId === productId)?.count ?? 0;
};
