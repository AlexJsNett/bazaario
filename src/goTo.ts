import type { RouteName } from './router.ts';
import { buildHash } from './logic/route.ts';

export const goTo = (name: RouteName, query?: Record<string, string>): void => {
  window.location.hash = buildHash(name, query);
};
