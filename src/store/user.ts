// All user data lives in ONE localStorage key. See AGENTS.md, section "User data".
// Only this file touches localStorage.

import type { Cart } from '../types/cart';
import type { ProductId } from '../types/product';

export type User = {
  favorites: ProductId[];
  cart: Cart;
};

export const USER_KEY = 'user';

// Sent on window after every updateUser, so the UI (header counters) can refresh.
export const USER_CHANGE_EVENT = 'user:change';

export const DEFAULT_USER: User = {
  favorites: [],
  cart: { products: [] },
};

export function getUser(): User {
  const user = structuredClone(DEFAULT_USER);
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw === null) {
      return user;
    }
    const saved: unknown = JSON.parse(raw);
    if (typeof saved !== 'object' || saved === null || Array.isArray(saved)) {
      return user;
    }
    // Merge field by field: a missing or broken field falls back to its default,
    // so old saved data does not break when a new field is added to User.
    const result: Record<string, unknown> = { ...user };
    for (const [key, value] of Object.entries(saved)) {
      const isBrokenArray = Array.isArray(result[key]) && !Array.isArray(value);
      if (!isBrokenArray) {
        result[key] = value;
      }
    }
    return result as User;
  } catch {
    return user;
  }
}

function saveUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // no localStorage or quota exceeded: the app keeps working, data is not saved
  }
}

// Reads the freshest data, applies `update`, saves. Never keep a copy of User yourself.
export function updateUser(update: (user: User) => User): void {
  saveUser(update(getUser()));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(USER_CHANGE_EVENT));
  }
}
