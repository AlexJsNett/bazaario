import { render as uiKitPageRender } from './pages/ui-kit/ui-kit.ts';
import { render as aboutPageRender } from './pages/about/about.ts';
import { render as cartPageRender } from './pages/cart/cart.ts';
import { render as catalogPageRender } from './pages/catalog/catalog.ts';
import { render as favoritesPageRender } from './pages/favorites/favorites.ts';
import { render as homePageRender } from './pages/home/home.ts';
import { buildHash, parseHash } from './logic/route.ts';

export type Route = {
  render: (query: URLSearchParams) => HTMLElement;
};

export type RouteName = 'ui-kit' | 'main' | 'about' | 'cart' | 'catalog' | 'favorites';

const DEFAULT_ROUTE: RouteName = 'about';

export const routes = new Map<RouteName, Route>([
  ['about', { render: aboutPageRender }],
  ['cart', { render: cartPageRender }],
  ['catalog', { render: catalogPageRender }],
  ['favorites', { render: favoritesPageRender }],
  ['ui-kit', { render: uiKitPageRender }],
  ['main', { render: homePageRender }],
]);

const isRouteName = (name: string): name is RouteName => routes.has(name as RouteName);

const refresh = (root: HTMLElement): void => {
  const { path, query } = parseHash(window.location.hash);
  let name: RouteName;

  if (isRouteName(path)) {
    name = path;
  } else {
    if (path) console.warn(`No route found: "${path}"`);
    name = DEFAULT_ROUTE;
    // replaceState fires no hashchange and adds no history entry,
    // so Back does not bounce off the fallback.
    window.history.replaceState(null, '', buildHash(name));
    query.forEach((_, key) => query.delete(key));
  }

  root.replaceChildren(routes.get(name)!.render(query));
};

export const createRouter = (root: HTMLElement): (() => void) => {
  const controller = new AbortController();

  window.addEventListener('hashchange', () => refresh(root), {
    signal: controller.signal,
  });

  refresh(root);

  return () => controller.abort();
};
