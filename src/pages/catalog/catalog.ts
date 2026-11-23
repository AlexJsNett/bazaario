import './catalog.scss';
import { createButton } from '../../components/button/button.ts';
import { createFiltersPanel } from '../../components/filters-panel/filters-panel.ts';
import { createPagination } from '../../components/pagination/pagination.ts';
import { createProductGrid } from '../../components/product-grid/product-grid.ts';
import { loadProducts } from '../../data/products.ts';
import { loadReviews } from '../../data/reviews.ts';
import { goTo } from '../../goTo.ts';
import { addToCart, decreaseInCart, getQuantity } from '../../logic/cart.ts';
import {
  clampPage,
  countActiveFilters,
  filterProducts,
  filtersToParams,
  getCategories,
  getPageCount,
  paginate,
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

const PHONE_QUERY = '(max-width: 639px)';
const PER_PAGE_PHONE = 6;
const PER_PAGE_DESKTOP = 12;
const FILTERS_ID = 'catalog-filters';

// pushState adds a history entry (Back works) but does not draw the page again.
const writeUrl = (filters: Filters): void => {
  const query = Object.fromEntries(filtersToParams(filters));
  window.history.pushState(null, '', buildHash('catalog', query));
};

// Reset opens a clean address: the page and the header search field are drawn again.
const resetFilters = (): void => goTo('catalog');

export const render = (query: URLSearchParams): HTMLElement => {
  const page = el('main', 'catalog-page');
  let filters = parseFilters(query);

  const draw = (products: Product[], reviews: Review[]): void => {
    const content = el('div', 'catalog-page__content');
    const result = el('div', 'catalog-page__result');
    const phone = window.matchMedia(PHONE_QUERY);

    // Only the result (count, grid, pager) is drawn again after a click, so the filters keep
    // their place on the screen.
    const drawResult = (animated = false): void => {
      const { favorites, cart } = getUser();
      const found = sortProducts(filterProducts(products, filters), filters.sort ?? 'default');
      const perPage = phone.matches ? PER_PAGE_PHONE : PER_PAGE_DESKTOP;
      const pageCount = getPageCount(found.length, perPage);
      const currentPage = clampPage(filters.page ?? 1, pageCount);
      const visible = paginate(found, currentPage, perPage);
      result.replaceChildren(
        el(
          'p',
          'catalog-page__count',
          `${found.length} ${found.length === 1 ? 'product' : 'products'}`,
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
        createPagination({
          page: currentPage,
          pageCount,
          onChange: (nextPage) => {
            filters = { ...filters, page: nextPage };
            writeUrl(filters);
            drawResult(true);
            // a new page starts from its first product, not from where the pager was
            result.scrollIntoView({ block: 'start', behavior: 'smooth' });
          },
        }),
      );
    };
    drawResult(true);

    // The phone shows 6 products, the desktop 12: draw again when the screen size changes.
    // The router drops this page without a signal, so the listener removes itself.
    const onScreenChange = (): void => {
      if (!page.isConnected) {
        phone.removeEventListener('change', onScreenChange);
        return;
      }
      drawResult();
    };
    phone.addEventListener('change', onScreenChange);

    // On a phone the filters are hidden behind a button.
    const filtersBox = el('div', 'catalog-page__filters');
    const toggle = createButton({ label: '', variant: 'outline' });
    toggle.classList.add('catalog-page__filters-toggle');
    toggle.setAttribute('aria-controls', FILTERS_ID);
    const updateToggle = (): void => {
      const open = filtersBox.classList.contains('catalog-page__filters--open');
      const count = countActiveFilters(filters);
      toggle.textContent = `${open ? 'Hide' : 'Show'} filters${count > 0 ? ` (${count})` : ''}`;
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => {
      filtersBox.classList.toggle('catalog-page__filters--open');
      updateToggle();
    });

    const panel = createFiltersPanel({
      categories: getCategories(products),
      filters,
      // The filters live in the URL. pushState adds a history entry (Back works) but does not
      // draw the page again, so the focus stays on the control the user just changed.
      // The new filters have no page, so the list starts from page 1.
      onChange: (next) => {
        filters = next;
        writeUrl(filters);
        updateToggle();
        drawResult(true);
      },
      onReset: resetFilters,
    });
    panel.id = FILTERS_ID;
    filtersBox.append(toggle, panel);
    updateToggle();

    content.append(el('h1', 'catalog-page__title', 'Catalog'), filtersBox, result);
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
