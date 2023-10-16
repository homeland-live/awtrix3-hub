import { describe, it, expect } from 'vitest';
import {
  maskRight,
  maskLeft,
  mask,
} from '@/util/string';

describe('string', () => {
  describe('maskRight', () => {
    it('masks into right direction', () => {
      expect(maskRight('foobar', 0)).toEqual('******');
      expect(maskRight('foobar', 2)).toEqual('fo****');
      expect(maskRight('foobar', 5)).toEqual('fooba*');
      expect(maskRight('foobar', 6)).toEqual('foobar');
      expect(maskRight('foobar', 7)).toEqual('foobar');
    });
  });

  describe('maskLeft', () => {
    it('masks into left direction', () => {
      expect(maskLeft('foobar', 0)).toEqual('foobar');
      expect(maskLeft('foobar', 2)).toEqual('****ar');
      expect(maskLeft('foobar', 5)).toEqual('*oobar');
      expect(maskLeft('foobar', 6)).toEqual('foobar');
      expect(maskLeft('foobar', 7)).toEqual('foobar');
    });
  });

  describe('mask', () => {
    it('masks the whole string', () => {
      expect(mask('foobar')).toEqual('******');
      expect(mask('foobar')).toEqual('******');
      expect(mask('foobar')).toEqual('******');
      expect(mask('foobar')).toEqual('******');
      expect(mask('foobar')).toEqual('******');
    });
  });
});
