import './ui-kit.scss';
import { createButton } from '../../components/button/button';
import { el } from '../../utils/dom';
import { createInput } from '../../components/input/input';
import { createPrice } from '../../components/price/price';
import { type BadgeOptions, createBadge } from '../../components/badge/badge.ts';
import { createRating } from '../../components/rating/rating.ts';
import { createHeader } from '../../components/header/header.ts';
import { createFooter } from '../../components/footer/footer.ts';
import { createFavoriteButton } from '../../components/favorite-button/favorite-button.ts';
import { createCart } from '../../components/cart/cart.ts';
import type { Cart } from '../../types/cart.ts';
import { changeQuantity, removeFromCart } from '../../logic/cart.ts';
import type { Product } from '../../types/product.ts';
import { createProductCard } from '../../components/product-card/product-card.ts';
import type { Product } from '../../types/product.ts';
import { createQuantityStepper } from '../../components/quantity-stepper/quantity-stepper.ts';

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
    id: 2,
    title: 'Pulse Buds Pro True Wireless Earbuds',
    category: 'Headphones',
    price: 59.9,
    rating: 4.2,
    image: 'images/02.webp',
    description: 'Demo product',
  },
];

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

function interactiveCard(product: Product, initialFavorite: boolean): HTMLElement {
  const host = el('div', 'ui-kit__card');
  const draw = (isFavorite: boolean, added: number): void => {
    host.replaceChildren(
      createProductCard({
        product,
        isFavorite,
        reviewsCount: 1280,
        onToggleFavorite: () => draw(!isFavorite, added),
        onAddToCart: () => draw(isFavorite, added + 1),
      }),
      el('code', 'ui-kit__demo-note', `added to cart: ${added}`),
    );
  };
  draw(initialFavorite, 0);
  return host;
}

function productCardBlock(): HTMLElement {
  const row = el('div', 'ui-kit__cards');
  row.append(
    demoWithDescription(interactiveCard(DEMO_PRODUCTS[0], false), 'With old price'),
    demoWithDescription(interactiveCard(DEMO_PRODUCTS[1], true), 'Favorite, long title'),
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

function interactiveFavorite(initial: boolean): HTMLElement {
  const host = el('div');
  const draw = (active: boolean): void => {
    host.replaceChildren(createFavoriteButton({ active, onToggle: () => draw(!active) }));
  };
  draw(initial);
  return host;
}

function favoriteButtonBlock(): HTMLElement {
  const row = el('div', 'ui-kit__row');
  row.append(demoWithDescription(interactiveFavorite(false), 'Demo', 'click to toggle'));
  return row;
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
    section('Favorite button', favoriteButtonBlock()),
    section('Cart', cartBlock()),
    section('Header', headerBlock()),
    section('Footer', footerBlock()),
  );

  page.append(header, content);
  return page;
}
