# Contributing

Short rules for both developers. Rules for agents are in `AGENTS.md`.

## Commits and PR titles: Conventional Commits

Format: `<type>[optional scope][!]: <description>`
Spec: https://www.conventionalcommits.org/en/v1.0.0/

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Scopes: `cart`, `catalog`, `favorites`, `home`, `about`, `ui`, `app`, `ci`
- Description: short, imperative, lowercase, no period at the end
- Examples: `feat(cart): add calculateTotal`, `fix(catalog): include max price in filter`, `test(favorites): cover toggle`

Husky runs commitlint on every commit message and lint-staged (ESLint, Prettier) on staged files. The PR title follows the same format because we squash merge and the PR title becomes the commit message.

## Branches

`<type>/<short-name>`: `feat/cart-logic`, `fix/price-filter`, `docs/readme`.

## Pull requests

1. One issue, one PR. Write `Closes #N` in the body.
2. Move the card to In Review when the PR is open.
3. Run `npm run lint && npm test && npm run build` before you ask for a review.
4. The reviewer clicks **Approve**, the author clicks **Merge** (squash). Nobody pushes to `main`.
5. Logic changes come with tests in the same PR.
6. UI follows `DESIGN.md`. Need something new? Change `DESIGN.md` first.
