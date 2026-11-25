import './poster.scss';
import { createBadge, type BadgeOptions } from '@/components/badge/badge';
import { el } from '@/utils/dom';

export type PosterOptions = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  background?: string;
  tone?: 'light' | 'ink';
  badge: BadgeOptions;
  href: string;
};

export const createPosterCopy = (
  title: string,
  subtitle: string,
  eyebrow?: string,
): HTMLElement => {
  const copy = el('div', 'poster__copy');
  if (eyebrow) {
    copy.append(el('span', 'poster__eyebrow', eyebrow));
  }
  copy.append(el('h3', 'poster__title', title), el('p', 'poster__subtitle', subtitle));
  return copy;
};

export const createPoster = (options: PosterOptions): HTMLElement => {
  const { eyebrow, title, subtitle, image, background, tone = 'ink', badge, href } = options;

  const poster = el('a', `poster poster--${tone}`);
  poster.href = href;
  if (background) {
    poster.style.backgroundColor = background;
  }

  const picture = el('img', 'poster__image');
  picture.src = image;
  picture.alt = '';

  const badgeBox = el('div', 'poster__badge');
  badgeBox.append(createBadge(badge));

  poster.append(picture, createPosterCopy(title, subtitle, eyebrow), badgeBox);
  return poster;
};
