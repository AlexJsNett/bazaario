import './ui-kit.scss';
import { createButton } from '@/components/button/button';
import { el } from '@/utils/dom';
import { createInput } from '@/components/input/input';
import { createPrice } from '@/components/price/price';
import { type BadgeOptions, createBadge } from '@/components/badge/badge.ts';
import { createRating } from '@/components/rating/rating.ts';
import { createHeader } from '@/components/header/header.ts';
import { createFooter } from '@/components/footer/footer.ts';
import { createCart } from '@/components/cart/cart.ts';
import { createCartSummary } from '@/components/cart-summary/cart-summary.ts';
import type { Cart } from '@/types/cart.ts';
import { changeQuantity, removeFromCart } from '@/logic/cart.ts';
import { createProductCard } from '@/components/product-card/product-card.ts';
import type { Product } from '@/types/product.ts';
import { createFiltersPanel } from '@/components/filters-panel/filters-panel.ts';
import { createPagination } from '@/components/pagination/pagination.ts';
import { createProductGrid } from '@/components/product-grid/product-grid.ts';
import { createProductRow } from '@/components/product-row/product-row.ts';
import { createReviewItem } from '@/components/review-item/review-item.ts';
import { createReviewList } from '@/components/review-list/review-list.ts';
import type { ReviewItem } from '@/types/reviews.ts';
import { createQuantityStepper } from '@/components/quantity-stepper/quantity-stepper.ts';
import { createCarousel } from '@/components/carousel/carousel.ts';
import { createPoster } from '@/components/poster/poster.ts';
import { createProductPoster } from '@/components/product-poster/product-poster.ts';
import posterImage from '@/assets/posters/black-friday.webp';

const COLORS = [
  'header',
  'primary',
  'primary-strong',
  'canvas',
  'surface',
  'ink',
  'body',
  'muted',
  'hairline',
  'sale',
  'sale-surface',
  'success',
  'success-surface',
  'error',
  'warning-surface',
  'warning-text',
  'star',
];

const noop = (): void => {};

const DEMO_REVIEWS: Record<number, number> = { 1: 1280, 2: 320 };

const DEMO_CART: Cart = {
  products: [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 3 },
  ],
};

const TEXT_STYLES = ['display', 'heading-lg', 'heading', 'lead', 'body', 'ui', 'caption'];
const SPACES = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const RADII = ['sm', 'md', 'full', 'circle'];

function section(title: string, ...children: HTMLElement[]): HTMLElement {
  const wrapper = el('section', 'ui-kit__section');
  wrapper.append(el('h2', 'ui-kit__title', title), ...children);
  return wrapper;
}

function demoWithDescription(demoEl: HTMLElement, title: string, note?: string) {
  const containerEl = el('div', 'ui-kit__demo');
  containerEl.appendChild(el('div', 'ui-kit__demo-title', title));

  if (note) {
    containerEl.appendChild(el('code', 'ui-kit__demo-note', note));
  }

  const stageEl = el('div', 'ui-kit__demo-stage');
  stageEl.appendChild(demoEl);
  containerEl.appendChild(stageEl);

  return containerEl;
}

function colorsBlock(): HTMLElement {
  const grid = el('div', 'ui-kit__colors');
  for (const name of COLORS) {
    const cssVar = `--color-${name}`;
    const card = el('div', 'ui-kit__color');
    const swatch = el('div', 'ui-kit__swatch');
    swatch.style.backgroundColor = `var(${cssVar})`;
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    card.append(swatch, el('code', undefined, cssVar), el('span', 'ui-kit__hint', value));
    grid.append(card);
  }
  return grid;
}

function typographyBlock(): HTMLElement {
  const list = el('div', 'ui-kit__list');
  for (const name of TEXT_STYLES) {
    const row = el('div', 'ui-kit__row');
    const sample = el('div', 'ui-kit__sample', 'Everything you need, in one place');
    sample.style.fontSize = `var(--text-${name}-size)`;
    sample.style.fontWeight = `var(--text-${name}-weight)`;
    sample.style.lineHeight = `var(--text-${name}-line)`;
    row.append(el('code', 'ui-kit__label', name), sample);
    list.append(row);
  }
  return list;
}

function spacingBlock(): HTMLElement {
  const list = el('div', 'ui-kit__list');
  for (const name of SPACES) {
    const row = el('div', 'ui-kit__row');
    const bar = el('div', 'ui-kit__bar');
    bar.style.width = `var(--space-${name})`;
    row.append(el('code', 'ui-kit__label', `--space-${name}`), bar);
    list.append(row);
  }
  return list;
}

function radiusBlock(): HTMLElement {
  const list = el('div', 'ui-kit__radii');
  for (const name of RADII) {
    const box = el('div', 'ui-kit__radius');
    box.style.borderRadius = `var(--radius-${name})`;
    const item = el('div', 'ui-kit__color');
    item.append(box, el('code', undefined, `--radius-${name}`));
    list.append(item);
  }
  return list;
}

function buttonsBlock(): HTMLElement {
  const row = el('div', 'ui-kit__inline');
  row.append(
    createButton({ label: 'Add to cart', variant: 'cart' }),
    createButton({ label: 'Sold out', variant: 'cart', disabled: true }),
    createButton({ label: 'Primary', variant: 'primary' }),
    createButton({ label: 'Primary disabled', variant: 'primary', disabled: true }),
    createButton({ label: 'Outline', variant: 'outline' }),
    createButton({ label: 'Outline disabled', variant: 'outline', disabled: true }),
  );
  return row;
}

function inputsBlock(): HTMLElement {
  const row = el('div', 'ui-kit__inputs');
  row.append(
    createInput({ id: 'demo-default', label: 'Default', placeholder: 'Find a product' }),
    createInput({ id: 'demo-value', label: 'With value', value: 'Headphones' }),
    createInput({
      id: 'demo-error',
      label: 'With error',
      type: 'email',
      value: 'not-an-email',
      error: 'Enter a valid email',
    }),
    createInput({ id: 'demo-disabled', label: 'Disabled', value: 'Read only', disabled: true }),
  );
  return row;
}

function badgeBlock(): HTMLElement {
  const demos = [
    'highlight',
    'deal',
    'discount',
    'success',
    'neutral',
    'save',
    'plain',
  ] satisfies BadgeOptions['variant'][];
  const row = el('div', 'ui-kit__inline');
  row.append(...demos.map((variant) => createBadge({ variant, label: String(variant) })));
  return row;
}

function priceBlock(): HTMLElement {
  const row = el('div', 'ui-kit__list');

  row.append(
    demoWithDescription(createPrice({ price: 2555.84 }), 'Minimal view'),
    demoWithDescription(
      createPrice({
        price: 25.84,
        oldPrice: 30.48,
        pricePerUnit: {
          price: 0.86,
          units: 100,
          unitLabel: 'Sheets',
        },
      }),
      'All options filled view',
    ),
    demoWithDescription(
      createPrice({
        price: 25.84,
        oldPrice: 30.48,
        pricePerUnit: {
          price: 0.86,
          units: 100,
          unitLabel: 'Sheets',
        },
        hideOldPrice: true,
      }),
      'Old price hidden',
    ),
  );
  return row;
}

function ratingBlock(): HTMLElement {
  const row = el('div', 'ui-kit__row');
  row.append(
    demoWithDescription(createRating({ score: 0, reviewsCount: 10 }), 'Min score', 'score 0'),
    demoWithDescription(
      createRating({ score: 3.1, reviewsCount: 1000 }),
      'Score lower',
      'score 3.1',
    ),
    demoWithDescription(createRating({ score: 3.6, reviewsCount: 10 }), 'score upper', 'score 3.6'),
    demoWithDescription(createRating({ score: 5, reviewsCount: 10 }), 'Max score', 'score 5'),
  );
  return row;
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Aurelia ANC Wireless Headphones',
    category: 'Headphones',
    price: 129.99,
    oldPrice: 169.99,
    rating: 4.6,
    image: 'images/01.webp',
    description: 'Demo product',
  },
  {
    id: 3,
    title: 'Nimbus Kids Safe-Sound Headphones with a very long name that is cut after two lines',
    category: 'Headphones',
    price: 24.5,
    rating: 4.1,
    image: 'images/03.webp',
    description: 'Demo product',
  },
];

function interactiveCard(
  product: Product,
  initialFavorite: boolean,
  initialAdded = 0,
): HTMLElement {
  const host = el('div', 'ui-kit__card');
  const draw = (isFavorite: boolean, added: number): void => {
    host.replaceChildren(
      createProductCard({
        product,
        isFavorite,
        reviewsCount: 1280,
        quantity: added,
        onToggleFavorite: () => draw(!isFavorite, added),
        onAddToCart: () => draw(isFavorite, added + 1),
        onDecrease: () => draw(isFavorite, added - 1),
      }),
      el('code', 'ui-kit__demo-note', `in cart: ${added}`),
    );
  };
  draw(initialFavorite, initialAdded);
  return host;
}

function productCardBlock(): HTMLElement {
  const row = el('div', 'ui-kit__cards');
  row.append(
    demoWithDescription(interactiveCard(DEMO_PRODUCTS[0], false), 'With old price'),
    demoWithDescription(interactiveCard(DEMO_PRODUCTS[1], true), 'Favorite, long title'),
    demoWithDescription(
      interactiveCard(DEMO_PRODUCTS[0], false, 2),
      'In the cart',
      'the button turns into a stepper, minus at 1 removes the product',
    ),
  );
  return row;
}

function interactiveStepper(initial: number): HTMLElement {
  const host = el('div');
  const draw = (quantity: number): void => {
    host.replaceChildren(
      createQuantityStepper({
        quantity,
        onIncrease: () => draw(quantity + 1),
        onDecrease: () => draw(quantity - 1),
      }),
    );
  };
  draw(initial);
  return host;
}

function quantityStepperBlock(): HTMLElement {
  const row = el('div', 'ui-kit__row');
  row.append(
    demoWithDescription(interactiveStepper(1), 'Demo', 'On minimum (1 item) minus disabled'),
  );
  return row;
}

function interactiveCart(initial: Cart): HTMLElement {
  const host = el('div');
  const draw = (cart: Cart): void => {
    host.replaceChildren(
      createCart({
        products: DEMO_PRODUCTS,
        cart,
        reviewsCount: DEMO_REVIEWS,
        onIncrease: (p) => draw(changeQuantity(cart, p.id, 1)),
        onDecrease: (p) => draw(changeQuantity(cart, p.id, -1)),
        onRemove: (p) => draw(removeFromCart(cart, p.id)),
      }),
    );
  };
  draw(initial);
  return host;
}

function cartBlock(): HTMLElement {
  const list = el('div', 'ui-kit__list');
  list.append(
    demoWithDescription(interactiveCart(DEMO_CART), 'With products'),
    demoWithDescription(interactiveCart({ products: [] }), 'Empty'),
  );
  return list;
}

function cartSummaryBlock(): HTMLElement {
  const row = el('div', 'ui-kit__row');
  row.append(
    demoWithDescription(
      createCartSummary({
        itemsCount: 4,
        subtotal: 349.2,
        discount: 0,
        total: 349.2,
        onApplyPromo: noop,
      }),
      'No promo code',
    ),
    demoWithDescription(
      createCartSummary({
        itemsCount: 4,
        subtotal: 349.2,
        discount: 34.92,
        total: 314.28,
        appliedCode: 'SALE10',
        promoValue: 'SALE10',
        onApplyPromo: noop,
      }),
      'Promo applied',
    ),
    demoWithDescription(
      createCartSummary({
        itemsCount: 4,
        subtotal: 349.2,
        discount: 0,
        total: 349.2,
        promoValue: 'WRONG',
        promoError: 'Promo code not found',
        onApplyPromo: noop,
      }),
      'Invalid code',
    ),
  );
  return row;
}

function filtersPanelBlock(): HTMLElement {
  const categories = ['Headphones', 'Microphones', 'Sneakers', 'Tablets'];
  const row = el('div', 'ui-kit__row');
  row.append(
    demoWithDescription(
      createFiltersPanel({ categories, filters: {}, onChange: noop, onReset: noop }),
      'Empty filters',
    ),
    demoWithDescription(
      createFiltersPanel({
        categories,
        filters: { category: 'Sneakers', min: 20, max: 100, minRating: 4, sort: 'price-asc' },
        onChange: noop,
        onReset: noop,
      }),
      'Filled filters',
      'selects apply at once, prices after a pause in typing',
    ),
  );
  return row;
}

function productGridBlock(): HTMLElement {
  return demoWithDescription(
    createProductGrid({
      products: [],
      favorites: [],
      onAddToCart: noop,
      onToggleFavorite: noop,
      onReset: noop,
    }),
    'Nothing found',
    'the grid with cards is shown in the Product card block and on the Catalog page',
  );
}

function interactivePagination(initial: number, pageCount: number): HTMLElement {
  const host = el('div');
  const draw = (page: number): void => {
    host.replaceChildren(createPagination({ page, pageCount, onChange: draw }));
  };
  draw(initial);
  return host;
}

function paginationBlock(): HTMLElement {
  const row = el('div', 'ui-kit__row');
  row.append(
    demoWithDescription(interactivePagination(1, 5), '5 pages', 'all pages are shown'),
    demoWithDescription(
      interactivePagination(10, 20),
      '20 pages',
      'the first and the last page, the dots in the middle',
    ),
  );
  return row;
}

const DEMO_REVIEW_ITEMS: ReviewItem[] = [
  {
    author: 'Anna K.',
    rating: 5,
    date: '2026-06-20',
    title: 'Great value',
    text: 'Does exactly what it says. I use it every day and it still feels like new.',
  },
  {
    author: 'Mark T.',
    rating: 4,
    date: '2026-04-02',
    title: 'Works well',
    text: 'Easy to start with, no problems so far. I would buy it again.',
  },
  {
    author: 'Olga S.',
    rating: 2,
    date: '2026-02-11',
    title: 'Could be better',
    text: 'Had a small problem after two weeks. I hope it was only my unit.',
  },
];

function reviewsBlock(): HTMLElement {
  const wrap = el('div', 'ui-kit__row');
  wrap.append(
    demoWithDescription(
      createReviewItem({ review: DEMO_REVIEW_ITEMS[0] }),
      'Review item',
      'author, date, stars, title and text',
    ),
    demoWithDescription(
      createReviewList({ reviews: DEMO_REVIEW_ITEMS, totalCount: 128 }),
      'Review list',
      'average, bars by stars and the reviews',
    ),
    demoWithDescription(createReviewList({ reviews: [] }), 'No reviews', 'empty state'),
  );
  return wrap;
}

function productRowBlock(): HTMLElement {
  return demoWithDescription(
    createProductRow({
      title: 'You may also like',
      products: DEMO_PRODUCTS.slice(0, 4),
      favorites: [],
      onAddToCart: noop,
      onToggleFavorite: noop,
    }),
    'Product row',
    'scrolls sideways on a phone, a grid on a desktop. The cards link to the product page',
  );
}

function postersBlock(): HTMLElement {
  const wrap = el('div', 'ui-kit__posters');
  wrap.append(
    createPoster({
      eyebrow: 'Black Friday deals on now',
      title: 'Black Friday is here',
      subtitle: 'Drops on tech, sound and sneakers.',
      image: posterImage,
      background: '#1b2433',
      tone: 'light',
      badge: { variant: 'deal', label: 'Up to 40% off' },
      href: '#/ui-kit',
    }),
    createProductPoster({
      title: "Don't miss these deals",
      subtitle: 'New prices every morning.',
      products: DEMO_PRODUCTS,
      productIds: DEMO_PRODUCTS.map((product) => product.id),
      background: 'primary',
      href: '#/ui-kit',
    }),
    createProductPoster({
      title: 'Top rated, no debate',
      subtitle: 'The best reviewed picks.',
      products: DEMO_PRODUCTS,
      productIds: DEMO_PRODUCTS.map((product) => product.id),
      background: 'header',
      info: 'rating',
      href: '#/ui-kit',
    }),
  );
  return demoWithDescription(
    wrap,
    'Poster and ProductPoster',
    'a picture poster, a 2x2 product poster with discounts, dark poster with ratings',
  );
}

function headerBlock(): HTMLElement {
  const header = createHeader({
    categories: ['Headphones', 'Microphones', 'Sneakers', 'Tablets'],
    favoritesCount: 3,
    cartCount: 2,
    activePath: 'catalog',
    onSearch: () => {},
  });
  return demoWithDescription(header.element, 'Header', 'mock data, resize the window');
}

function footerBlock(): HTMLElement {
  return demoWithDescription(createFooter(), 'Footer');
}

function carouselBlock() {
  const childs = new Array(6)
    .fill(() =>
      createPoster({
        eyebrow: 'Eyebrow',
        title: 'Title',
        subtitle: 'Subtitle',
        image: 'none',
        background: '#1b2433',
        tone: 'light',
        badge: { variant: 'deal', label: 'label' },
        href: '#/ui-kit',
      }),
    )
    .map((m) => m());
  const carousel = createCarousel({ childs });
  carousel.style.width = '100%';
  return demoWithDescription(carousel, 'Regular carousel');
}

export function render(): HTMLElement {
  const page = el('main', 'ui-kit');

  const header = el('header', 'ui-kit__header');
  const logo = el('img', 'ui-kit__logo');
  logo.src = `${import.meta.env.BASE_URL}logo-on-dark.svg`;
  logo.alt = 'Bazaario';
  header.append(logo, el('span', 'ui-kit__header-note', 'Design system'));

  const content = el('div', 'ui-kit__content');
  content.append(
    el('p', 'ui-kit__intro', 'Everything here is built from the tokens described in DESIGN.md.'),
    section('Colors', colorsBlock()),
    section('Typography', typographyBlock()),
    section('Spacing', spacingBlock()),
    section('Radius', radiusBlock()),
    section('Button', buttonsBlock()),
    section('Input', inputsBlock()),
    section('Badge', badgeBlock()),
    section('Price', priceBlock()),
    section('Rating', ratingBlock()),
    section('Quantity stepper', quantityStepperBlock()),
    section('Product card', productCardBlock()),
    section('Cart', cartBlock()),
    section('Cart summary', cartSummaryBlock()),
    section('Filters panel', filtersPanelBlock()),
    section('Product grid', productGridBlock()),
    section('Pagination', paginationBlock()),
    section('Reviews', reviewsBlock()),
    section('Product row', productRowBlock()),
    section('Posters', postersBlock()),
    section('Carousel', carouselBlock()),
    section('Header', headerBlock()),
    section('Footer', footerBlock()),
  );

  page.append(header, content);
  return page;
}
