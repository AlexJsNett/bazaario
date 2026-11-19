import './badge.scss';

export type BadgeOptions = {
  variant?: 'highlight' | 'deal' | 'discount' | 'success' | 'neutral' | 'save' | 'plain';
  label: string;
};

export const createBadge = (options: BadgeOptions) => {
  const { variant = 'highlight', label } = options;
  const badgeEl = document.createElement('span');
  badgeEl.classList.add('badge', `badge--${variant}`);
  badgeEl.textContent = label;
  return badgeEl;
};
