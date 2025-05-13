import { describe, it, expect } from 'vitest';
import { hexToInt, intToHex, rgbToInt, intToRgb } from '@/util/color';

describe('color', () => {
  describe('hexToInt', () => {
    it('translates hex to decimal', () => {
      expect(hexToInt('#0')).toEqual(0);
      expect(hexToInt('#000')).toEqual(0);
      expect(hexToInt('#000000')).toEqual(0);
      expect(hexToInt('#fff')).toEqual(16777215);
      expect(hexToInt('#ffffff')).toEqual(16777215);
      expect(hexToInt('#dc3545')).toEqual(14431557);
      expect(hexToInt('#0d6efd')).toEqual(880381);
    });
  });

  describe('intToHex', () => {
    it('translates decimal to hex', () => {
      expect(intToHex(0)).toEqual('000000');
      expect(intToHex(16777215)).toEqual('ffffff');
      expect(intToHex(14431557)).toEqual('dc3545');
      expect(intToHex(880381)).toEqual('0d6efd');
    });
  });

  describe('rgbToInt', () => {
    it('translates rbg to decimal', () => {
      expect(rgbToInt({ r: 0, g: 0, b: 0 })).toEqual(0);
      expect(rgbToInt({ r: 255, g: 255, b: 255 })).toEqual(16777215);
      expect(rgbToInt({ r: 220, g: 53, b: 69 })).toEqual(14431557);
      expect(rgbToInt({ r: 13, g: 110, b: 253 })).toEqual(880381);
    });
  });

  describe('intToRgb', () => {
    it('translates decimal to rgb', () => {
      expect(intToRgb(0)).toEqual({ r: 0, g: 0, b: 0 });
      expect(intToRgb(16777215)).toEqual({ r: 255, g: 255, b: 255 });
      expect(intToRgb(14431557)).toEqual({ r: 220, g: 53, b: 69 });
      expect(intToRgb(880381)).toEqual({ r: 13, g: 110, b: 253 });
    });
  });
});
