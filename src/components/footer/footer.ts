import './footer.scss';
import { buildHash } from '../../logic/route';

export const createFooter = (): HTMLElement => {
  const footer = document.createElement('footer');
  footer.className = 'footer';

  const inner = document.createElement('div');
  inner.className = 'footer__inner';

  const nav = document.createElement('nav');
  nav.className = 'footer__nav';
  nav.setAttribute('aria-label', 'Footer');
  const about = document.createElement('a');
  about.className = 'footer__link';
  about.href = buildHash('about');
  about.textContent = 'About us';
  nav.append(about);

  const note = document.createElement('p');
  note.className = 'footer__note';
  note.textContent = 'Bazaario is a demo store. Nothing here is really for sale.';

  inner.append(nav, note);
  footer.append(inner);
  return footer;
};
