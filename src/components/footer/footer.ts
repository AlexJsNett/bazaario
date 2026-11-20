import './footer.scss';
import { buildHash } from '../../logic/route';

const LINKS: [string, string][] = [
  ['home', 'Home'],
  ['catalog', 'Catalog'],
  ['favorites', 'Favorites'],
  ['cart', 'Cart'],
  ['about', 'About us'],
];

export const createFooter = (): HTMLElement => {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const inner = document.createElement('div');
  inner.className = 'footer__inner';

  const nav = document.createElement('nav');
  nav.className = 'footer__nav';
  nav.setAttribute('aria-label', 'Footer');
  for (const [path, label] of LINKS) {
    const link = document.createElement('a');
    link.className = 'footer__link';
    link.href = buildHash(path);
    link.textContent = label;
    nav.append(link);
  }

  const note = document.createElement('p');
  note.className = 'footer__note';
  note.textContent = 'Bazaario is a demo store. Nothing here is really for sale.';

  inner.append(nav, note);
  footer.append(inner);
  return footer;
};
