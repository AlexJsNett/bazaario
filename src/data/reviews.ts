import type { Review } from '@/types/reviews.ts';

const REVIEWS_URL = 'api/reviews.json';

export const loadReviews = async (): Promise<Review[]> => {
  const url = import.meta.env.BASE_URL + REVIEWS_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to load reviews from ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
};
