import './catalog.scss';
import { createFiltersPanel } from '../../components/filters-panel/filters-panel.ts';
import { createProductGrid } from '../../components/product-grid/product-grid.ts';
import { loadProducts } from '../../data/products.ts';
import { loadReviews } from '../../data/reviews.ts';
import { goTo } from '../../goTo.ts';
import { addToCart, decreaseInCart, getQuantity } from '../../logic/cart.ts';
import {
  filterProducts,
  filtersToParams,
  getCategories,
  parseFilters,
  sortProducts,
  type Filters,
} from '../../logic/catalog.ts';
import { toggleFavorite } from '../../logic/favorites.ts';
import { buildHash } from '../../logic/route.ts';
import { getReviews } from '../../logic/reviews.ts';
import { getUser, updateUser } from '../../store/user.ts';
import type { Product } from '../../types/product.ts';
import type { Review } from '../../types/reviews.ts';
import { el } from '../../utils/dom.ts';

type CatalogData = { products: Product[]; reviews: Review[] };

// The page is drawn again on every filter change. The data is loaded once and kept here,
// so the next draw is instant and the page does not flash "Loading...".
let cached: CatalogData | undefined;

const loadData = async (): Promise<CatalogData> => {
  if (cached) {
    return cached;
  }
  // Reviews are optional: if they fail to load, the cards show 0 reviews.
  const loadingReviews = loadReviews().catch((error): Review[] => {
    console.error(error);
    return [];
  });
  const [products, reviews] = await Promise.all([loadProducts(), loadingReviews]);
  cached = { products, reviews };
  return cached;
};

const toQuery = (filters: Filters): Record<string, string> =>
  Object.fromEntries(filtersToParams(filters));

// Reset opens a clean address: the page and the header search field are drawn again.
const resetFilters = (): void => goTo('catalog');

export const render = (query: URLSearchParams): HTMLElement => {
  const page = el('main', 'catalog-page');
  let filters = parseFilters(query);

  const draw = (products: Product[], reviews: Review[]): void => {
    const content = el('div', 'catalog-page__content');
    const result = el('div', 'catalog-page__result');

    // Only the grid is drawn again after "add to cart" or a heart click,
    // so the filters keep their place on the screen.
    const drawResult = (animated = false): void => {
      const { favorites, cart } = getUser();
      const visible = sortProducts(filterProducts(products, filters), filters.sort ?? 'default');
      result.replaceChildren(
        el(
          'p',
          'catalog-page__count',
          `${visible.length} ${visible.length === 1 ? 'product' : 'products'}`,
        ),
        createProductGrid({
          products: visible,
          favorites,
          quantities: Object.fromEntries(
            visible.map((product) => [product.id, getQuantity(cart, product.id)]),
          ),
          reviewsCount: Object.fromEntries(
            visible.map((product) => [product.id, getReviews(reviews, product.id)]),
          ),
          // The cart changes, so the grid is drawn again to show the new quantity.
          onAddToCart: (product) => {
            updateUser((user) => ({ ...user, cart: addToCart(user.cart, product.id) }));
            drawResult();
          },
          onDecrease: (product) => {
            updateUser((user) => ({ ...user, cart: decreaseInCart(user.cart, product.id) }));
            drawResult();
          },
          onToggleFavorite: (product) => {
            updateUser((user) => ({
              ...user,
              favorites: toggleFavorite(user.favorites, product.id),
            }));
            drawResult();
          },
          onReset: resetFilters,
          animated,
        }),
      );
    };
    drawResult(true);

    content.append(
      el('h1', 'catalog-page__title', 'Catalog'),
      createFiltersPanel({
        categories: getCategories(products),
        filters,
        // The filters live in the URL. pushState adds a history entry (Back works) but does not
        // draw the page again, so the focus stays on the control the user just changed.
        onChange: (next) => {
          filters = next;
          window.history.pushState(null, '', buildHash('catalog', toQuery(next)));
          drawResult(true);
        },
        onReset: resetFilters,
      }),
      result,
    );
    page.replaceChildren(content);
  };

  const fail = (error: unknown): void => {
    console.error(error);
    page.replaceChildren(
      el('p', 'catalog-page__message', 'Could not load products, try again later'),
    );
  };

  if (cached) {
    draw(cached.products, cached.reviews);
    return page;
  }

  page.append(el('p', 'catalog-page__message', 'Loading...'));
  loadData()
    .then(({ products, reviews }) => draw(products, reviews))
    .catch(fail);

  return page;
};
