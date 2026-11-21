import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_USER, USER_CHANGE_EVENT, USER_KEY, getUser, updateUser, type User } from './user';

function createFakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createFakeStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getUser', () => {
  it('returns defaults when storage is empty', () => {
    expect(getUser()).toEqual(DEFAULT_USER);
  });

  it('returns defaults when the saved JSON is broken', () => {
    vi.stubGlobal('localStorage', createFakeStorage({ [USER_KEY]: '{oops' }));
    expect(getUser()).toEqual(DEFAULT_USER);
  });

  it('returns defaults when the saved value is not an object', () => {
    vi.stubGlobal('localStorage', createFakeStorage({ [USER_KEY]: '[1,2]' }));
    expect(getUser()).toEqual(DEFAULT_USER);
  });

  it('fills a missing field in old saved data', () => {
    vi.stubGlobal('localStorage', createFakeStorage({ [USER_KEY]: '{"favorites":[1,2]}' }));
    const expected: User = { favorites: [1, 2], cart: { products: [] } };
    expect(getUser()).toEqual(expected);
  });

  it('uses the default when a saved array field has a wrong type', () => {
    vi.stubGlobal('localStorage', createFakeStorage({ [USER_KEY]: '{"favorites":"abc"}' }));
    expect(getUser().favorites).toEqual([]);
  });

  it('does not share the default arrays between calls', () => {
    getUser().favorites.push(99);
    expect(getUser().favorites).toEqual([]);
  });

  it('returns defaults when localStorage throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
    });
    expect(getUser()).toEqual(DEFAULT_USER);
  });
});

describe('updateUser', () => {
  it('saves the change and getUser returns it', () => {
    updateUser((user) => ({ ...user, favorites: [5] }));
    expect(getUser().favorites).toEqual([5]);
  });

  it('keeps the other fields when one field changes', () => {
    updateUser((user) => ({ ...user, cart: { products: [{ productId: 1, quantity: 2 }] } }));
    updateUser((user) => ({ ...user, favorites: [3] }));

    const expected: User = {
      favorites: [3],
      cart: { products: [{ productId: 1, quantity: 2 }] },
    };

    expect(getUser()).toEqual(expected);
  });

  it('sends the user:change event on window', () => {
    const fakeWindow = new EventTarget();
    vi.stubGlobal('window', fakeWindow);
    const listener = vi.fn();
    fakeWindow.addEventListener(USER_CHANGE_EVENT, listener);
    updateUser((user) => user);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not crash when saving fails', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    });
    expect(() => updateUser((user) => user)).not.toThrow();
  });
});
