import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the function once after the delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('restarts the delay on every call and uses the last arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced('a');
    vi.advanceTimersByTime(200);
    debounced('b');
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });

  it('can be called again after it has fired', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    vi.advanceTimersByTime(100);
    debounced();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('cancel drops the waiting call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();
  });
});
