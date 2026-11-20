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

const MENU_ITEMS: [string, string][] = [
  ['home', 'Home'],
  ['catalog', 'Catalog'],
  ['favorites', 'Favorites'],
  ['cart', 'Cart'],
  ['about', 'About us'],
];

const markActive = (link: HTMLAnchorElement, active: boolean, className: string): void => {
  link.classList.toggle(className, active);
  if (active) {
    link.setAttribute('aria-current', 'page');
  } else {
    link.removeAttribute('aria-current');
  }
};

export const createHeader = (options: HeaderOptions): Header => {
  const { categories, onSearch, ...initialState } = options;
  const state: HeaderState = { ...initialState };

  const header = document.createElement('header');
  header.className = 'header';

  const top = document.createElement('div');
  top.className = 'header__top';

  const burger = document.createElement('button');
  burger.className = 'header__burger';
  burger.type = 'button';
  burger.setAttribute('aria-label', 'Menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'header-menu');
  for (let i = 0; i < 3; i += 1) {
    const line = document.createElement('span');
    line.className = 'header__burger-line';
    burger.append(line);
  }

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
  // on a phone the Catalog and About us links live in the burger menu
  const catalogLink = createLink(
    'header__link header__link--wide',
    buildHash('catalog'),
    'Catalog',
  );
  const aboutLink = createLink('header__link header__link--wide', buildHash('about'), 'About us');
  const favoritesLink = createLink('header__link', buildHash('favorites'), 'Favorites');
  const cartLink = createLink('header__link', buildHash('cart'), 'Cart');
  const favoritesCount = document.createElement('span');
  favoritesCount.className = 'header__count';
  const cartCount = document.createElement('span');
  cartCount.className = 'header__count';
  favoritesLink.append(favoritesCount);
  cartLink.append(cartCount);
  nav.append(catalogLink, aboutLink, favoritesLink, cartLink);

  top.append(burger, logo, search, nav);

  // The burger menu has all pages. It is shown only on a phone.
  const menu = document.createElement('nav');
  menu.className = 'header__menu';
  menu.id = 'header-menu';
  menu.setAttribute('aria-label', 'Pages');
  const menuLinks: [HTMLAnchorElement, string][] = MENU_ITEMS.map(([path, label]) => [
    createLink('header__menu-link', buildHash(path), label),
    path,
  ]);
  menu.append(...menuLinks.map(([link]) => link));

  const setMenuOpen = (open: boolean): void => {
    menu.classList.toggle('header__menu--open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => {
    setMenuOpen(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      setMenuOpen(false);
    }
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
      burger.focus();
    }
  });

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

  header.append(top, menu, categoryNav);

  const links: [HTMLAnchorElement, string][] = [
    [catalogLink, 'catalog'],
    [aboutLink, 'about'],
    [favoritesLink, 'favorites'],
    [cartLink, 'cart'],
  ];

  const render = (): void => {
    favoritesCount.textContent = String(state.favoritesCount);
    favoritesLink.setAttribute('aria-label', `Favorites, ${state.favoritesCount} items`);
    cartCount.textContent = String(state.cartCount);
    cartLink.setAttribute('aria-label', `Cart, ${state.cartCount} items`);
    for (const [link, path] of links) {
      markActive(link, state.activePath === path, 'header__link--active');
    }
    for (const [link, path] of menuLinks) {
      markActive(link, state.activePath === path, 'header__menu-link--active');
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
      if (next.activePath !== undefined && next.activePath !== state.activePath) {
        setMenuOpen(false);
      }
      Object.assign(state, next);
      render();
    },
    setCategories: renderCategories,
  };
};
