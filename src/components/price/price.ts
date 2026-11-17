import './price.scss';

export type PriceParts = {
  currency: string;
  main: number;
  sub: number;
};

export type PricePerUnit = {
  price: PriceParts;
  units: number;
  unitLabel: string;
};

export type PriceOptions = {
  price: PriceParts;
  oldPrice?: PriceParts;
  /** Discount in percent, e.g. 15 renders "-15%" */
  discount?: number;
  pricePerUnit?: PricePerUnit;
};

const createSpan = (className: string, text: string): HTMLSpanElement => {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
};

const formatSub = (sub: number): string => String(sub).padStart(2, '0');

const formatFlat = ({ currency, main, sub }: PriceParts): string =>
  `${currency} ${main}.${formatSub(sub)}`;

const createAmount = (parts: PriceParts): HTMLSpanElement => {
  const amount = createSpan('price__amount', '');
  amount.append(
    createSpan('price__currency', parts.currency),
    createSpan('price__main', String(parts.main)),
    createSpan('price__sub', formatSub(parts.sub)),
  );
  return amount;
};

export const createPrice = (options: PriceOptions): HTMLDivElement => {
  const { price, oldPrice, discount, pricePerUnit } = options;

  const priceEl = document.createElement('div');
  priceEl.className = 'price';

  const current = document.createElement('div');
  current.className = 'price__current';

  if (typeof discount === 'number') {
    current.append(createSpan('price__discount', `-${discount}%`));
  }
  current.append(createAmount(price));

  if (pricePerUnit) {
    const { price: unitPrice, units, unitLabel } = pricePerUnit;
    current.append(createSpan('price__unit', `(${formatFlat(unitPrice)} /${units} ${unitLabel})`));
  }
  priceEl.append(current);

  if (oldPrice) {
    const old = document.createElement('div');
    old.className = 'price__old';
    old.append('List Price: ', createSpan('price__old-value', formatFlat(oldPrice)));
    priceEl.append(old);
  }

  return priceEl;
};
