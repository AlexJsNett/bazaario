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
  data/          products
  logic/         pure functions + tests next to the file
  store/         state and localStorage
  components/    UI kit
  pages/         one folder per page
  styles/        tokens and base styles
```

Rules are described in issue #46.

## Commits

Conventional Commits: `type(scope): description`, for example `feat(cart): add calculateTotal`.
Husky runs two hooks: before a commit ESLint and Prettier check the staged files, and commitlint checks the commit message.
