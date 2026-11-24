import './review-item.scss';
import type { ReviewItem } from '@/types/reviews';
import { el } from '@/utils/dom';
import { createRating } from '@/components/rating/rating';

export type ReviewItemOptions = {
  review: ReviewItem;
};

export const createReviewItem = (options: ReviewItemOptions): HTMLElement => {
  const { review } = options;

  const item = el('article', 'review-item');
  const header = el('div', 'review-item__header');
  header.append(
    el('span', 'review-item__author', review.author),
    el('time', 'review-item__date', review.date),
  );
  item.append(
    header,
    createRating({ score: review.rating }),
    el('h3', 'review-item__title', review.title),
    el('p', 'review-item__text', review.text),
  );
  return item;
};
