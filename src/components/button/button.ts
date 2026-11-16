import './button.scss';

export type ButtonVariant = 'primary' | 'outline';

export interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export function createButton(options: ButtonOptions): HTMLButtonElement {
  const { label, variant = 'primary', type = 'button', disabled = false, onClick } = options;

  const button = document.createElement('button');
  button.className = `button button--${variant}`;
  button.type = type;
  button.textContent = label;
  button.disabled = disabled;

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
