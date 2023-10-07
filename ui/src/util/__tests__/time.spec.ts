import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'; // eslint-disable-line object-curly-newline
import { seconds } from '@/util/time';

describe('time', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('seconds', () => {
    it('returns num of seconds between now and given date', () => {
      vi.setSystemTime(new Date('2021-07-14T08:24:52'));
      expect(seconds('2021-07-14T08:24:51')).toBe(1);
    });
  });
});
