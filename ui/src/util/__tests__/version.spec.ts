import { describe, it, expect } from 'vitest';
import { gt } from '@/util/version';

describe('version', () => {
  describe('gt', () => {
    it('checks whether a version higher than another', () => {
      expect(gt('0.88', '0.88')).toEqual(false);
      expect(gt('0.89', '0.88')).toEqual(true);
    });
  });
});
