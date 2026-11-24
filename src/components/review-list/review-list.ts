import './review-list.scss';
import type { ReviewItem } from '@/types/reviews';
import { el } from '@/utils/dom';
import { getAverageRating, getRatingBreakdown } from '@/logic/reviews';
import { createRating } from '@/components/rating/rating';
import { createReviewItem } from '@/components/review-item/review-item';

export type ReviewListOptions = {
  reviews: ReviewItem[];
  /** all reviews of the product, may be more than the shown `reviews` */
  totalCount?: number;
};

export const createReviewList = (options: ReviewListOptions): HTMLElement => {
  const { reviews, totalCount = reviews.length } = options;

  const section = el('section', 'review-list');
  section.append(el('h2', 'review-list__title', 'Customer reviews'));

  if (reviews.length === 0) {
    section.append(el('p', 'review-list__empty', 'No reviews yet.'));
    return section;
  }

  const summary = el('div', 'review-list__summary');
  const average = el('div', 'review-list__average');
  average.append(
    el('span', 'review-list__average-value', getAverageRating(reviews).toFixed(1)),
    createRating({ score: getAverageRating(reviews), reviewsCount: totalCount }),
  );

  const bars = el('ul', 'review-list__bars');
  getRatingBreakdown(reviews).forEach((count, index) => {
    const row = el('li', 'review-list__bar-row');
    const track = el('span', 'review-list__bar-track');
    const fill = el('span', 'review-list__bar-fill');
    fill.style.width = `${Math.round((count / reviews.length) * 100)}%`;
    track.append(fill);
    row.append(el('span', 'review-list__bar-label', `${5 - index} star`), track);
    row.append(el('span', 'review-list__bar-count', String(count)));
    bars.append(row);
  });
  summary.append(average, bars);

  const list = el('div', 'review-list__items');
  list.append(...reviews.map((review) => createReviewItem({ review })));

  section.append(summary, list);
  return section;
};
