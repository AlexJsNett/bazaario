import './price.scss';
import { createBadge } from '@/components/badge/badge';
import { formatNumber } from '@/logic/utils/formatNumber.ts';

export type PriceParts = {
  currency: string;
  main: string;
  sub: string;
};

export type PricePerUnit = {
  price: number;
  units: number;
  unitLabel: string;
};

export type PriceOptions = {
  price: number;
  oldPrice?: number;
  hideOldPrice?: boolean;
  currency?: string;
  pricePerUnit?: PricePerUnit;
};

const createSpan = (className: string, text: string): HTMLSpanElement => {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
};

const getPriceParts = (currency: string, price: number): PriceParts => {
  const main = Math.floor(price).toString(10);
  const sub = Math.floor((price % 1) * 100).toString(10);
  return { currency, main, sub };
};

const formatSub = (sub: string): string => sub.padStart(2, '0');

const formatFlat = ({ currency, main, sub }: PriceParts): string =>
  `${currency} ${formatNumber(main)}.${formatSub(sub)}`;

const createAmount = (parts: PriceParts): HTMLSpanElement => {
  const amount = createSpan('price__amount', '');
  amount.append(
    createSpan('price__currency', parts.currency),
    createSpan('price__main', formatNumber(parts.main)),
    createSpan('price__sub', formatSub(parts.sub)),
  );
  return amount;
};

export const getDiscount = (currentPrice: number, oldPrice: number) =>
  Math.round(Math.abs((currentPrice / oldPrice) * 100 - 100));

export const createPrice = (options: PriceOptions): HTMLDivElement => {
  const { price, oldPrice, pricePerUnit, currency = 'EUR', hideOldPrice = false } = options;

  const priceEl = document.createElement('div');
  priceEl.className = 'price';

  const current = document.createElement('div');
  current.className = 'price__current';

  if (oldPrice) {
    const discount = getDiscount(price, oldPrice);
    current.append(createBadge({ variant: 'discount', label: `-${discount}%` }));
  }
  const priceParts: PriceParts = getPriceParts(currency, price);
  current.append(createAmount(priceParts));

  if (pricePerUnit) {
    const { price: unitPrice, units, unitLabel } = pricePerUnit;
    const perUnitPriceParts: PriceParts = getPriceParts(currency, unitPrice);
    current.append(
      createSpan('price__unit', `(${formatFlat(perUnitPriceParts)} /${units} ${unitLabel})`),
    );
  }
  priceEl.append(current);

  if (oldPrice && !hideOldPrice) {
    const old = document.createElement('div');
    old.className = 'price__old';
    const oldPriceParts: PriceParts = getPriceParts(currency, oldPrice);
    old.append('List Price: ', createSpan('price__old-value', formatFlat(oldPriceParts)));
    priceEl.append(old);
  }

  return priceEl;
};
