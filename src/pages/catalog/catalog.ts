import './catalog.scss';
import { createFiltersPanel } from '../../components/filters-panel/filters-panel.ts';
import { createProductGrid } from '../../components/product-grid/product-grid.ts';
import { loadProducts } from '../../data/products.ts';
import { loadReviews } from '../../data/reviews.ts';
import { goTo } from '../../goTo.ts';
import { addToCart } from '../../logic/cart.ts';
import {
  filterProducts,
  filtersToParams,
  getCategories,
  parseFilters,
  sortProducts,
  type Filters,
} from '../../logic/catalog.ts';
import { toggleFavorite } from '../../logic/favorites.ts';
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

// The filters live in the URL, so the page is drawn again on every change (Back works).
const openWithFilters = (filters: Filters): void => {
  goTo('catalog', Object.fromEntries(filtersToParams(filters)));
};

export const render = (query: URLSearchParams): HTMLElement => {
  const page = el('main', 'catalog-page');
  const filters = parseFilters(query);

  const draw = (products: Product[], reviews: Review[]): void => {
    const visible = sortProducts(filterProducts(products, filters), filters.sort ?? 'default');
    const content = el('div', 'catalog-page__content');
    const result = el('div', 'catalog-page__result');

    // Only the grid is drawn again after "add to cart" or a heart click,
    // so the filters keep their place on the screen.
    const drawResult = (): void => {
      const { favorites } = getUser();
      result.replaceChildren(
        el(
          'p',
          'catalog-page__count',
          `${visible.length} ${visible.length === 1 ? 'product' : 'products'}`,
        ),
        createProductGrid({
          products: visible,
          favorites,
          reviewsCount: Object.fromEntries(
            visible.map((product) => [product.id, getReviews(reviews, product.id)]),
          ),
          onAddToCart: (product) =>
            updateUser((user) => ({ ...user, cart: addToCart(user.cart, product.id) })),
          onToggleFavorite: (product) => {
            updateUser((user) => ({
              ...user,
              favorites: toggleFavorite(user.favorites, product.id),
            }));
            drawResult();
          },
          onReset: () => openWithFilters({}),
        }),
      );
    };
    drawResult();

    content.append(
      el('h1', 'catalog-page__title', 'Catalog'),
      createFiltersPanel({
        categories: getCategories(products),
        filters,
        onChange: openWithFilters,
        onReset: () => openWithFilters({}),
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
