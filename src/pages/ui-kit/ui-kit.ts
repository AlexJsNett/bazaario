import './ui-kit.scss';
import { createButton } from '../../components/button/button';
import { createInput } from '../../components/input/input';
import { createPrice } from '../../components/price/price';
import { type BadgeOptions, createBadge } from '../../components/badge/badge.ts';
import { createRating } from '../../components/rating/rating.ts';

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

const TEXT_STYLES = ['display', 'heading-lg', 'heading', 'lead', 'body', 'ui', 'caption'];
const SPACES = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const RADII = ['sm', 'md', 'full', 'circle'];

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text) {
    node.textContent = text;
  }
  return node;
}

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
    createButton({ label: 'Add to cart', variant: 'primary' }),
    createButton({ label: 'Details', variant: 'outline' }),
    createButton({ label: 'Sold out', variant: 'primary', disabled: true }),
    createButton({ label: 'Unavailable', variant: 'outline', disabled: true }),
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
    demoWithDescription(
      createPrice({ price: { currency: 'EUR', main: 25, sub: 84 } }),
      'Minimal view',
    ),
    demoWithDescription(
      createPrice({
        price: { currency: 'EUR', main: 25, sub: 84 },
        oldPrice: { currency: 'EUR', main: 30, sub: 48 },
        discount: 15,
        pricePerUnit: {
          price: { currency: 'EUR', main: 0, sub: 86 },
          units: 100,
          unitLabel: 'Sheets',
        },
      }),
      'All options filled view',
    ),
  );
  return row;
}

function ratingBlock(): HTMLElement {
  const row = el('div', 'ui-kit__row');
  row.append(
    demoWithDescription(createRating({ score: 0 }), 'Min score', 'score 0'),
    demoWithDescription(createRating({ score: 3.1 }), 'Score lower', 'score 3.1'),
    demoWithDescription(createRating({ score: 3.6 }), 'score upper', 'score 3.6'),
    demoWithDescription(createRating({ score: 5 }), 'Max score', 'score 5'),
  );
  return row;
}

export function render(container: HTMLElement): void {
  container.replaceChildren();

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
  );

  page.append(header, content);
  container.append(page);
}
