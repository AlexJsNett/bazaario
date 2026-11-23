import './cart-summary.scss';
import { el } from '@/utils/dom';
import { createButton } from '@/components/button/button';
import { createInput } from '@/components/input/input';
import { createPrice } from '@/components/price/price';

export type CartSummaryOptions = {
  itemsCount: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCode?: string;
  promoError?: string;
  promoValue?: string;
  onPromoInput?: (value: string) => void;
  onApplyPromo: () => void;
};

const createMoney = (amount: number): HTMLElement => {
  const wrapper = el('div', 'cart-summary__money');
  wrapper.append(createPrice({ price: amount }));
  return wrapper;
};

const createRow = (label: string, value: HTMLElement, modifier?: string): HTMLDivElement => {
  const row = el(
    'div',
    modifier ? `cart-summary__row cart-summary__row--${modifier}` : 'cart-summary__row',
  );
  row.append(el('span', 'cart-summary__label', label), value);
  return row;
};

const createPromoForm = (options: CartSummaryOptions): HTMLFormElement => {
  const form = el('form', 'cart-summary__promo');
  form.noValidate = true;
  form.append(
    createInput({
      id: 'cart-promo',
      label: 'Promo code',
      placeholder: 'Enter code',
      value: options.promoValue,
      error: options.promoError,
      onInput: options.onPromoInput,
    }),
    createButton({ label: 'Apply', variant: 'outline', type: 'submit' }),
  );
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    options.onApplyPromo();
  });
  return form;
};

export const createCartSummary = (options: CartSummaryOptions): HTMLElement => {
  const { itemsCount, subtotal, discount, total, appliedCode } = options;

  const root = el('aside', 'cart-summary');
  root.append(el('h2', 'cart-summary__title', 'Order summary'), createPromoForm(options));

  if (appliedCode) {
    root.append(el('p', 'cart-summary__applied', `Code ${appliedCode} applied`));
  }

  root.append(createRow(`Subtotal (${itemsCount} items)`, createMoney(subtotal)));
  if (discount > 0) {
    root.append(createRow('Discount', createMoney(discount), 'discount'));
  }
  root.append(createRow('Total', createMoney(total), 'total'));
  return root;
};
