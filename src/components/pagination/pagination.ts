import './pagination.scss';
import { getPageItems } from '@/logic/catalog';
import { el } from '@/utils/dom';

export type PaginationOptions = {
  /** current page, from 1 */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

const createPageButton = (
  label: string,
  ariaLabel: string,
  onClick: () => void,
  modifier?: string,
): HTMLButtonElement => {
  const button = el('button', modifier ? `pagination__button ${modifier}` : 'pagination__button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-label', ariaLabel);
  button.addEventListener('click', onClick);
  return button;
};

// Arrows and page numbers: the first and the last page, the current one with its neighbours,
// and the dots between. Returns an empty nav for one page, so the caller can skip it.
export const createPagination = (options: PaginationOptions): HTMLElement => {
  const { page, pageCount, onChange } = options;

  const nav = el('nav', 'pagination');
  nav.setAttribute('aria-label', 'Pages');
  if (pageCount <= 1) {
    nav.hidden = true;
    return nav;
  }

  const previous = createPageButton('‹', 'Previous page', () => onChange(page - 1));
  previous.disabled = page <= 1;
  const next = createPageButton('›', 'Next page', () => onChange(page + 1));
  next.disabled = page >= pageCount;

  nav.append(previous);
  for (const item of getPageItems(page, pageCount)) {
    if (item === 'gap') {
      const gap = el('span', 'pagination__gap', '…');
      gap.setAttribute('aria-hidden', 'true');
      nav.append(gap);
      continue;
    }
    const button = createPageButton(String(item), `Page ${item}`, () => onChange(item));
    if (item === page) {
      button.classList.add('pagination__button--current');
      button.setAttribute('aria-current', 'page');
    }
    nav.append(button);
  }
  nav.append(next);
  return nav;
};
