# AGENTS.md

Bazaario: Amazon-like marketplace, frontend only, no backend. Two developers. Full rules: issue #46. Design: `DESIGN.md`. Human docs: `README.md`.

## Stack and commands

TypeScript, Vite (vanilla, no framework), Vitest, SCSS (`sass-embedded`), ESLint, Prettier, Husky.

- `npm run dev` | `npm run build` (tsc + vite build)
- `npm test` (Vitest, once) | `npm run test:watch`
- `npm run lint` | `npm run format`
- Before finishing a task run: `npm run lint && npm test && npm run build`

## Structure

```
src/
  main.ts       entry, hash router lives here
  types/        shared types only (Product, CartItem), no logic
  utils/        small DOM helpers shared by pages and components (el), no app logic
  data/         loaders for mock API data (fetch from public/api)
  logic/        pure functions + *.test.ts next to the file
  store/        user.ts: the only place that touches localStorage
  assets/       fonts, icons, images imported from code (hashed by Vite)
  components/   UI kit, one folder per component (name.ts + name.scss)
  pages/        one folder per page, exports render(query: URLSearchParams): HTMLElement
  styles/       tokens.scss (CSS variables), main.scss (reset, base)
public/
  api/          mock API: JSON files (products.json), fetched at runtime
  images/       product images referenced from the JSON files
  favicon.svg, logo-*.svg
```

## Rules

1. `logic/` is pure: no DOM, no imports from `components/`, `pages/`, `store/`.
2. `components/` take data via arguments and report events via callbacks. They never read the store.
3. `pages/` connect components, store and logic. A page exports `render(query: URLSearchParams): HTMLElement`: it receives the parsed hash query and returns the page element, and the router mounts it.
4. Only `store/` touches localStorage.
5. One folder per page and per component. Do not edit files owned by another task.
6. Mock API: data lives in `public/api/*.json`. Fetch with `import.meta.env.BASE_URL + 'api/products.json'` (the site is served under `/bazaario/` on GitHub Pages), never with a hard-coded `/api/...`.
7. Every logic function has tests in the same PR. Cover normal case, edge case, and that input is not mutated.
8. Shared types live in `src/types/` (one file per topic). No logic and no imports from other layers there. Import them with `import type`. Do not declare `Product` or `CartItem` again in another file.
9. Imports: use the alias `@` for `src` when the file is in another folder (`import { addToCart } from '@/logic/cart'`, `url('@/assets/icons/x.svg')` in styles). Use `./file` only for files in the same folder. No `../`.

## User data (localStorage)

All user data lives in ONE localStorage key `user`: a JSON object of type `User`, for example `{ favorites: [...], cart: [...] }`. Favorites, cart and any future data (orders) are fields of this object.

- Only `src/store/user.ts` reads or writes it: `getUser(): User` and `updateUser(update: (user: User) => User): void`.
- Never keep a copy of `User` in a variable. Read fresh with `getUser()`, or change with `updateUser(fn)` (it reads fresh, applies `fn`, saves). Favorites and cart are written from different places, a stale copy would overwrite the other part.
- `logic/` stays pure: functions take one field (`user.cart`) and return a new value. The page connects them: `updateUser((user) => ({ ...user, favorites: toggleFavorite(user.favorites, id) }))`.
- New data: add a field to `User` and to `DEFAULT_USER`. `getUser()` fills missing fields, so old saved data does not break.
- Broken JSON or no localStorage: return defaults, never crash.
- Do not call `localStorage` anywhere else, do not create other keys.

## Design

- `DESIGN.md` is the source of truth. Use only CSS variables from `src/styles/tokens.scss`. No hex colors, no new sizes in components.
- Need a new color, size or component? Change `DESIGN.md` first, then tokens, then code.
- Token names: `--color-*`, `--space-*`, `--radius-*`, `--font-family`, `--text-<style>-size|weight|line`.
- Orange (`--color-primary`) is the main action. Red only for sale and errors. Text on orange is dark.
- New component: add a block to the showcase page `src/pages/ui-kit/` in the same PR.

## Git

- Conventional Commits: `type(scope): description`. Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. Scopes: cart, catalog, favorites, home, about, ui, app, ci. Husky and commitlint check it.
- Branches: `feat/cart-logic`, `fix/price-filter`, `docs/readme`.
- One issue, one PR. PR title follows Conventional Commits. Put `Closes #N` in the body. Squash merge.
- Reviewer clicks Approve, author clicks Merge. Never push to `main`.
- No Co-Authored-By or "Generated with" lines in commits or PRs.

## Task flow

- Tasks are issues on the board: https://github.com/users/AlexJsNett/projects/3 . Check blockers before starting.
- Statuses: Todo, In Progress, In Review, Done. Move the card when the PR is opened.
- Code and comments in English. Keep functions small and typed. No `any`.
