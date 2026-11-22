import './quantity-stepper.scss';
import { el } from '../../utils/dom';

export type QuantityStepperOptions = {
  quantity: number;
  min?: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const createStepButton = (label: string, ariaLabel: string, onClick: () => void) => {
  const button = el('button', 'quantity-stepper__button', label);
  button.type = 'button';
  button.setAttribute('aria-label', ariaLabel);
  button.addEventListener('click', onClick);
  return button;
};

export const createQuantityStepper = (options: QuantityStepperOptions): HTMLDivElement => {
  const { quantity, min = 1, onIncrease, onDecrease } = options;

  const root = el('div', 'quantity-stepper');
  const value = el('span', 'quantity-stepper__value', String(quantity));
  const decrease = createStepButton('−', 'Decrease quantity', onDecrease);
  decrease.disabled = quantity <= min;
  const increase = createStepButton('+', 'Increase quantity', onIncrease);

  root.append(decrease, value, increase);
  return root;
};
