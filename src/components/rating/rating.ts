import './rating.scss';
import starIcon from '../../assets/stars/star.svg';
import starHalfIcon from '../../assets/stars/star-half.svg';
import starEmptyIcon from '../../assets/stars/star-empty.svg';

export type RatingOptions = {
  /* float number 0 - 5 */
  score: number;
};

type StarType = 'empty' | 'half' | 'full';

const getStars = (score: number): StarType[] => {
  return new Array(5).fill('empty' as StarType).map((v: StarType, i) => {
    if (i + 1 <= score) {
      return 'full';
    } else if (i + 0.5 <= score) {
      return 'half';
    }
    return v;
  });
};

const prepareScore = (score: number) => {
  return Math.floor(score * 100) / 100;
};

export const createRating = (options: RatingOptions) => {
  const { score } = options;
  const preparedScore = prepareScore(score);
  const icons = getStars(preparedScore).map((st) => {
    const star = document.createElement('img');
    star.classList.add('rating__star');
    star.alt = '';
    switch (st) {
      case 'empty':
        star.src = starEmptyIcon;
        break;
      case 'half':
        star.src = starHalfIcon;
        break;
      case 'full':
        star.src = starIcon;
        break;
    }
    return star;
  });

  const container = document.createElement('div');
  container.classList.add('rating');
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', `Rating ${preparedScore} out of 5`);
  const scoreEl = document.createElement('span');
  scoreEl.textContent = String(preparedScore);
  scoreEl.classList.add('rating__score');
  const starsContainer = document.createElement('div');
  starsContainer.classList.add('rating__stars');
  starsContainer.append(...icons);
  container.append(scoreEl, starsContainer);
  return container;
};
