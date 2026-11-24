import type { Review, ReviewItem } from '@/types/reviews.ts';
import type { ProductId } from '@/types/product.ts';

export const getReviews = (reviews: Review[], productId: ProductId): number => {
  return reviews.find((review) => review.productId === productId)?.count ?? 0;
};

export const getReviewItems = (reviews: Review[], productId: ProductId): ReviewItem[] => {
  return reviews.find((review) => review.productId === productId)?.items ?? [];
};

/** How many reviews have each rating: index 0 is 5 stars, index 4 is 1 star. */
export const getRatingBreakdown = (items: ReviewItem[]): number[] => {
  const result = [0, 0, 0, 0, 0];
  for (const item of items) {
    const star = Math.round(item.rating);
    if (star >= 1 && star <= 5) {
      result[5 - star] += 1;
    }
  }
  return result;
};

/** Average rating of the reviews, rounded to one decimal. 0 for an empty list. */
export const getAverageRating = (items: ReviewItem[]): number => {
  if (items.length === 0) {
    return 0;
  }
  const sum = items.reduce((total, item) => total + item.rating, 0);
  return Math.round((sum / items.length) * 10) / 10;
};
