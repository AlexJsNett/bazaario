import './filters-panel.scss';
import { ALL_CATEGORIES, type Filters, type SortMode } from '../../logic/catalog';
import { el } from '../../utils/dom';
import { createButton } from '../button/button';
import { createInput } from '../input/input';

export type FiltersPanelOptions = {
  categories: string[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
};

const SORT_OPTIONS: [SortMode, string][] = [
  ['default', 'Featured'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['rating-desc', 'Best rating'],
];

const RATING_OPTIONS: [number, string][] = [
  [0, 'Any rating'],
  [3, '3 stars & up'],
  [4, '4 stars & up'],
  [4.5, '4.5 stars & up'],
];

const createSelect = (
  id: string,
  label: string,
  options: [string, string][],
  value: string,
): { field: HTMLElement; select: HTMLSelectElement } => {
  const field = el('div', 'filters-panel__field');
  const labelEl = el('label', 'filters-panel__label', label);
  labelEl.htmlFor = id;
  const select = el('select', 'filters-panel__select');
  select.id = id;
  for (const [optionValue, optionLabel] of options) {
    const option = el('option', '', optionLabel);
    option.value = optionValue;
    select.append(option);
  }
  select.value = value;
  field.append(labelEl, select);
  return { field, select };
};

// A number from a field: empty, text and negative values mean "no limit".
const readNumber = (input: HTMLInputElement): number | undefined => {
  if (input.value.trim() === '') {
    return undefined;
  }
  const value = Number(input.value);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

// The panel knows nothing about the URL or the store. It shows the given filters
// and reports a new set of them through onChange.
export const createFiltersPanel = (options: FiltersPanelOptions): HTMLFormElement => {
  const { categories, filters, onChange, onReset } = options;

  const form = el('form', 'filters-panel');
  form.noValidate = true;
  form.setAttribute('aria-label', 'Product filters');

  const category = createSelect(
    'filter-category',
    'Category',
    [
      [ALL_CATEGORIES, 'All categories'],
      ...categories.map((name): [string, string] => [name, name]),
    ],
    filters.category ?? ALL_CATEGORIES,
  );
  const rating = createSelect(
    'filter-rating',
    'Rating',
    RATING_OPTIONS.map(([value, label]): [string, string] => [String(value), label]),
    String(filters.minRating ?? 0),
  );
  const sort = createSelect('filter-sort', 'Sort by', SORT_OPTIONS, filters.sort ?? 'default');

  const min = createInput({
    id: 'filter-min',
    label: 'Price from',
    type: 'number',
    placeholder: '0',
    value: filters.min === undefined ? '' : String(filters.min),
  });
  const max = createInput({
    id: 'filter-max',
    label: 'Price to',
    type: 'number',
    placeholder: 'Any',
    value: filters.max === undefined ? '' : String(filters.max),
  });
  const minInput = min.querySelector('input')!;
  const maxInput = max.querySelector('input')!;
  minInput.min = '0';
  maxInput.min = '0';

  const reset = createButton({ label: 'Reset', variant: 'outline', onClick: onReset });
  reset.classList.add('filters-panel__reset');

  form.append(category.field, min, max, rating.field, sort.field, reset);

  // Numbers apply on "change" (blur or Enter), not on every key, so typing is not interrupted.
  form.addEventListener('change', () => {
    onChange({
      query: filters.query,
      category: category.select.value,
      min: readNumber(minInput),
      max: readNumber(maxInput),
      minRating: Number(rating.select.value),
      sort: sort.select.value as SortMode,
    });
  });
  form.addEventListener('submit', (event) => event.preventDefault());

  return form;
};
