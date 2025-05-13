import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { secondsSince, fmtSeconds } from '@/util/time';

describe('time', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('secondsSince', () => {
    it('returns num of seconds between now and given date', () => {
      vi.setSystemTime(new Date('2021-07-14T08:24:52'));
      expect(secondsSince('2021-07-14T08:24:51')).toBe(1);
    });
  });

  describe('fmtSeconds', () => {
    it('formats number of seconds into `?d ?h ?m ?s`', () => {
      expect(fmtSeconds(0)).toBe('0s');
      expect(fmtSeconds(1)).toBe('1s');
      expect(fmtSeconds(42)).toBe('42s');
      expect(fmtSeconds(60)).toBe('1m 0s');
      expect(fmtSeconds(60 + 1)).toBe('1m 1s');
      expect(fmtSeconds(60 * 60)).toBe('1h 0s');
      expect(fmtSeconds(60 * 60 + 1)).toBe('1h 1s');
      expect(fmtSeconds(60 * 60 + 60)).toBe('1h 1m 0s');
      expect(fmtSeconds(60 * 60 + 60 + 1)).toBe('1h 1m 1s');
      expect(fmtSeconds(60 * 60 * 24 + 60 * 60 + 60 + 1)).toBe('1d 1h 1m 1s');
    });
  });
});
