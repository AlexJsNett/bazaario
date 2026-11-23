export type Debounced<Args extends unknown[]> = ((...args: Args) => void) & {
  /** drop the call that is waiting, if any */
  cancel: () => void;
};

// Calls `fn` only after `delay` ms have passed since the last call.
// Used to wait for the user to stop typing before doing the work.
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args): void => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };
  debounced.cancel = (): void => {
    clearTimeout(timer);
    timer = undefined;
  };
  return debounced;
}
