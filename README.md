# team-store
Team project: online store (RS School)

## Stack
TypeScript, Vite (vanilla-ts), Vitest, SCSS.

## Scripts
- `npm install` install dependencies
- `npm run dev` start dev server
- `npm run build` type check and build
- `npm test` run tests once
- `npm run test:watch` run tests in watch mode

## Structure
```
src/
  main.ts        entry point
  data/          products
  logic/         pure functions + tests next to the file
  store/         state and localStorage
  components/    UI kit
  pages/         one folder per page
  styles/        tokens and base styles
```
Rules are described in issue #46.

## UI components
Styles use only CSS variables from `src/styles/tokens.scss` (see `DESIGN.md`).

```ts
import { createButton } from './components/button/button';
import { createInput } from './components/input/input';

const add = createButton({ label: 'Add to cart', variant: 'primary', onClick: () => {} });
const more = createButton({ label: 'Details', variant: 'outline' });
const off = createButton({ label: 'Sold out', disabled: true });

const search = createInput({ id: 'q', label: 'Search', placeholder: 'Find a product', onInput: (value) => {} });
const email = createInput({ id: 'email', type: 'email', error: 'Enter a valid email' });
```
- `createButton` returns a `<button>`. Options: `label`, `variant` (`primary` or `outline`), `type`, `disabled`, `onClick`.
- `createInput` returns a `<div>` with label, `<input>` and an error message. Options: `id`, `label`, `type`, `value`, `placeholder`, `error`, `disabled`, `onInput`.
