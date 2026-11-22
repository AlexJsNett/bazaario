import './styles/main.scss';
import { createRouter } from './router.ts';
import { createDefaultLayout } from './components/layout/layout.ts';
import { createHeader } from './components/header/header.ts';
import { createFooter } from './components/footer/footer.ts';
import { loadProducts } from './data/products.ts';
import { goTo } from './goTo.ts';
import { getCategories } from './logic/catalog.ts';
import { getFavoritesCount } from './logic/favorites.ts';
import { parseHash } from './logic/route.ts';
import { USER_CHANGE_EVENT, getUser } from './store/user.ts';
import { getCartCount } from './logic/cart.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;

// The category menu needs the products. If loading fails, the menu has only "All".
const loadCategories = async (): Promise<string[]> => {
  try {
    return getCategories(await loadProducts());
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getCounts = () => {
  const user = getUser();
  return {
    favoritesCount: getFavoritesCount(user.favorites),
    cartCount: getCartCount(user.cart),
  };
};

const routerEl = document.createElement('div');
routerEl.id = 'router';

const header = createHeader({
  ...getCounts(),
  categories: [],
  onSearch: (query) => goTo('catalog', query ? { query } : undefined),
});
const layout = createDefaultLayout(header.element, routerEl, createFooter());
app.append(layout);

const syncHeader = (): void => {
  const { path, query } = parseHash(window.location.hash);
  header.update({ ...getCounts(), activePath: path, query: query.get('query') ?? '' });
};

const destroyRouter = createRouter(routerEl);

void loadCategories().then(header.setCategories);

// the router may replace a wrong address, so sync after it has started
syncHeader();
const controller = new AbortController();
window.addEventListener('hashchange', syncHeader, { signal: controller.signal });
window.addEventListener(USER_CHANGE_EVENT, syncHeader, { signal: controller.signal });

// prevent events duplication on dev server
import.meta.hot?.dispose(() => {
  destroyRouter();
  controller.abort();
});
