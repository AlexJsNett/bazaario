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
- `npm run lint` check code with ESLint (`lint:fix` fixes it)
- `npm run format` format with Prettier (`format:check` only checks)

## Structure

```
src/
  main.ts        entry point
  data/          loaders for mock API data
  logic/         pure functions + tests next to the file
  store/         state and localStorage
  assets/        fonts, icons, images used in code
  components/    UI kit
  pages/         one folder per page
  styles/        tokens and base styles
public/
  api/           mock API, JSON files
  images/        product images used by the JSON
```

Module rules, design rules and git rules are in [AGENTS.md](AGENTS.md) (written for AI agents, useful for people too). Design is described in `DESIGN.md`.

## UI components

Styles use only CSS variables from `src/styles/tokens.scss` (see `DESIGN.md`).

```ts
import { createButton } from './components/button/button';
import { createInput } from './components/input/input';

const add = createButton({ label: 'Add to cart', variant: 'primary', onClick: () => {} });
const more = createButton({ label: 'Details', variant: 'outline' });
const off = createButton({ label: 'Sold out', disabled: true });

const search = createInput({
  id: 'q',
  label: 'Search',
  placeholder: 'Find a product',
  onInput: (value) => {},
});
const email = createInput({ id: 'email', type: 'email', error: 'Enter a valid email' });
```

- `createButton` returns a `<button>`. Options: `label`, `variant` (`primary` or `outline`), `type`, `disabled`, `onClick`.
- `createInput` returns a `<div>` with label, `<input>` and an error message. Options: `id`, `label`, `type`, `value`, `placeholder`, `error`, `disabled`, `onInput`.

## Commits

Conventional Commits: `type(scope): description`, for example `feat(cart): add calculateTotal`.
Husky runs two hooks: before a commit ESLint and Prettier check the staged files, and commitlint checks the commit message.

## Design system showcase and deploy

- The showcase page (`src/pages/ui-kit/`) shows colors, typography, spacing, radius and the components with all their states. Add a block for every new component in the same PR.
- The site is published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`: https://alexjsnett.github.io/bazaario/
- The site is served under `/bazaario/`. `vite.config.ts` sets `base` for the build, so use `import.meta.env.BASE_URL` for paths to files in `public/`.
