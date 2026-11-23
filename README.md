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
  types/         shared types (Product, CartItem)
  utils/         small DOM helpers (el)
  data/          loaders for mock API data
  logic/         pure functions + tests next to the file
  store/         user.ts: all user data in one localStorage key `user`
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
- `createBadge` returns `<span>` with inner text from `label` option, has several `variant` options (all match real Amazon website use cases):
  - `highlight` (default): dark background, white text. For labels like "Bazaario's Choice".
  - `deal`: solid red background, white text. For labels like "Early Black Friday Deal".
  - `discount`: light red background, red text. For discounts like "-15%".
  - `success`: light green background, green text.
  - `neutral`: light gray background, gray text.
  - `save`: light green background, green text and green border. For offers like "Save 5%".
  - `plain`: no background, dark body-size text. For lines like "5K+ bought in past month".
- `createPrice` returns a `<div>` with the current price. Options:
  - `price`: current price as a number, e.g. `19.99`.
  - `oldPrice` (optional): old price as a number, shown as "List Price: ...". The discount badge ("-15%") is calculated from `price` and `oldPrice`.
  - `hideOldPrice` (optional): if `true`, the "List Price" line is hidden, the discount badge stays.
  - `currency` (optional): currency text, default `EUR`.
  - `pricePerUnit` (optional): `{ price, units, unitLabel }`, `price` is a number, shown as "(EUR 1.99 /10 count)".
- `createRating` returns a `<div>` with the score number, five stars (full, half or empty) and the reviews count. Options: `score` (number from 0 to 5, cut to two decimals), `reviewsCount` (number, shown in brackets).
- `createHeader` returns `{ element, update, setCategories }`. The header has the logo, a search field, links to Catalog, About us (not on a phone), Favorites and Cart with counters, and a menu of categories (links to `#/catalog?category=...`). On a phone (under 640px) a burger button opens a menu with all pages (Home, Catalog, Favorites, Cart, About us); the menu closes on a click, on Escape and on page change. Options: `categories`, `favoritesCount`, `cartCount`, `activePath` (the matching link is highlighted), `query` (text of the search field), `onSearch(query)`. The header never reads the store: `main.ts` passes the counters and calls `update` on `hashchange` and on the `user:change` event.
- `createFiltersPanel` returns a `<form>` with category, price from and to, minimum rating, sort and a Reset button. Options: `categories`, `filters` (current values), `onChange(filters)`, `onReset`. It keeps the `query` of the given filters. Selects report a change at once, the price fields after 400 ms without typing (`debounce` from `utils/debounce.ts`), and the same filters are never reported twice. The panel does not know the URL or the store.
- `createProductGrid` returns a grid of `ProductCard` or, for an empty list, the "Nothing found" message with a "Reset filters" button. Options: `products`, `favorites` (ids), `quantities` (cart count by product id), `reviewsCount` (by product id), `onAddToCart`, `onDecrease`, `onToggleFavorite`, `onReset` (optional). A product that is in the cart shows a stepper instead of the "Add to cart" button; minus at 1 removes it from the cart (`decreaseInCart` in `logic/cart.ts`).
- `createPagination` returns a `<nav>` with arrows and page numbers: the first and the last page, the current one with its neighbours and dots between (`getPageItems` in `logic/catalog.ts`). Options: `page` (from 1), `pageCount`, `onChange(page)`. For one page the nav is hidden.
- `createFooter` returns a `<footer>` with a link to About us and a short note.

## Commits

Conventional Commits: `type(scope): description`, for example `feat(cart): add calculateTotal`.
Husky runs two hooks: before a commit ESLint and Prettier check the staged files, and commitlint checks the commit message.

## Design system showcase and deploy

- The showcase page (`src/pages/ui-kit/`) shows colors, typography, spacing, radius and the components with all their states. Add a block for every new component in the same PR. Available on path: <deploy url>/#/ui-kit
- The site is published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`: https://alexjsnett.github.io/bazaario/
- The site is served under `/bazaario/`. `vite.config.ts` sets `base` for the build, so use `import.meta.env.BASE_URL` for paths to files in `public/`.
