import './input.scss';

export interface InputOptions {
  id: string;
  label?: string;
  type?: 'text' | 'email' | 'search' | 'number';
  value?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onInput?: (value: string) => void;
}

export function createInput(options: InputOptions): HTMLDivElement {
  const {
    id,
    label,
    type = 'text',
    value = '',
    placeholder = '',
    error,
    disabled = false,
    onInput,
  } = options;

  const field = document.createElement('div');
  field.className = 'input-field';

  if (label) {
    const labelElement = document.createElement('label');
    labelElement.className = 'input-field__label';
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    field.append(labelElement);
  }

  const input = document.createElement('input');
  input.className = 'input-field__input';
  input.id = id;
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;
  input.disabled = disabled;

  if (onInput) {
    input.addEventListener('input', () => onInput(input.value));
  }

  field.append(input);

  if (error) {
    const errorId = `${id}-error`;
    const errorElement = document.createElement('p');
    errorElement.className = 'input-field__error';
    errorElement.id = errorId;
    errorElement.textContent = error;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
    field.classList.add('input-field--error');
    field.append(errorElement);
  }

  return field;
}
