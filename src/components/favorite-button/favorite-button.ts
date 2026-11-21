import './favorite-button.scss';
import { el } from '../../utils/dom';

export type FavoriteButtonOptions = {
  active: boolean;
  onToggle: () => void;
};

/** Heart icon from Lucide (ISC license) */
const SVG_NS = 'http://www.w3.org/2000/svg';
const HEART_PATH =
  'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5';

const createHeartIcon = (): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('favorite-button__icon');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', HEART_PATH);
  svg.append(path);
  return svg;
};

export const createFavoriteButton = (options: FavoriteButtonOptions): HTMLButtonElement => {
  const { active, onToggle } = options;

  const button = el('button', 'favorite-button');
  button.type = 'button';
  button.classList.toggle('favorite-button--active', active);
  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', active ? 'Remove from favorites' : 'Add to favorites');
  button.append(createHeartIcon());
  button.addEventListener('click', onToggle);
  return button;
};
