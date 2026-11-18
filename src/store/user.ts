// All user data lives in ONE localStorage key. See AGENTS.md, section "User data".
// Only this file touches localStorage.

// TODO(#30): replace ProductId with Product['id'] when the Product type exists.
export type ProductId = number;

// TODO(#31): CartItem moves to logic/cart when the cart logic lands.
export type CartItem = { productId: ProductId; quantity: number };

export type User = {
  favorites: ProductId[];
  cart: CartItem[];
};

export const USER_KEY = 'user';

export const DEFAULT_USER: User = {
  favorites: [],
  cart: [],
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
}
