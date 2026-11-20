import './header.scss';
import { buildHash } from '../../logic/route';

export type HeaderState = {
  favoritesCount: number;
  cartCount: number;
  /** route path of the open page, e.g. 'catalog'. The matching link is highlighted */
  activePath?: string;
  /** current search text, shown in the search field */
  query?: string;
};

export type HeaderOptions = HeaderState & {
  categories: string[];
  onSearch: (query: string) => void;
};

export type Header = {
  element: HTMLElement;
  /** call when the counters, the open page or the search text change */
  update: (state: Partial<HeaderState>) => void;
  /** call when the list of categories is loaded or changed */
  setCategories: (categories: string[]) => void;
};

const createLink = (className: string, href: string, text: string): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.className = className;
  link.href = href;
  link.textContent = text;
  return link;
};

export const createHeader = (options: HeaderOptions): Header => {
  const { categories, onSearch, ...initialState } = options;
  const state: HeaderState = { ...initialState };

  const header = document.createElement('header');
  header.className = 'header';

  const top = document.createElement('div');
  top.className = 'header__top';

  const logo = document.createElement('a');
  logo.className = 'header__logo';
  logo.href = buildHash('home');
  const logoImg = document.createElement('img');
  logoImg.src = `${import.meta.env.BASE_URL}logo-on-dark.svg`;
  logoImg.alt = 'Bazaario';
  logo.append(logoImg);

  const search = document.createElement('form');
  search.className = 'header__search';
  search.setAttribute('role', 'search');
  const searchInput = document.createElement('input');
  searchInput.className = 'header__search-input';
  searchInput.type = 'search';
  searchInput.placeholder = 'Search Bazaario';
  searchInput.setAttribute('aria-label', 'Search products');
  const searchButton = document.createElement('button');
  searchButton.className = 'header__search-button';
  searchButton.type = 'submit';
  searchButton.textContent = 'Search';
  search.append(searchInput, searchButton);
  search.addEventListener('submit', (event) => {
    event.preventDefault();
    onSearch(searchInput.value.trim());
  });

  const nav = document.createElement('nav');
  nav.className = 'header__nav';
  nav.setAttribute('aria-label', 'Main');
  const catalogLink = createLink('header__link', buildHash('catalog'), 'Catalog');
  const favoritesLink = createLink('header__link', buildHash('favorites'), 'Favorites');
  const cartLink = createLink('header__link', buildHash('cart'), 'Cart');
  const favoritesCount = document.createElement('span');
  favoritesCount.className = 'header__count';
  const cartCount = document.createElement('span');
  cartCount.className = 'header__count';
  favoritesLink.append(favoritesCount);
  cartLink.append(cartCount);
  nav.append(catalogLink, favoritesLink, cartLink);

  top.append(logo, search, nav);

  const categoryNav = document.createElement('nav');
  categoryNav.className = 'header__categories';
  categoryNav.setAttribute('aria-label', 'Categories');
  const renderCategories = (names: string[]): void => {
    categoryNav.replaceChildren(
      createLink('header__category', buildHash('catalog'), 'All'),
      ...names.map((category) =>
        createLink('header__category', buildHash('catalog', { category }), category),
      ),
    );
  };
  renderCategories(categories);

  header.append(top, categoryNav);

  const links: [HTMLAnchorElement, string][] = [
    [catalogLink, 'catalog'],
    [favoritesLink, 'favorites'],
    [cartLink, 'cart'],
  ];

  const render = (): void => {
    favoritesCount.textContent = String(state.favoritesCount);
    favoritesLink.setAttribute('aria-label', `Favorites, ${state.favoritesCount} items`);
    cartCount.textContent = String(state.cartCount);
    cartLink.setAttribute('aria-label', `Cart, ${state.cartCount} items`);
    for (const [link, path] of links) {
      link.classList.toggle('header__link--active', state.activePath === path);
      if (state.activePath === path) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }
    // do not overwrite the text while the user is typing
    if (document.activeElement !== searchInput) {
      searchInput.value = state.query ?? '';
    }
  };

  render();

  return {
    element: header,
    update: (next) => {
      Object.assign(state, next);
      render();
    },
    setCategories: renderCategories,
  };
};
