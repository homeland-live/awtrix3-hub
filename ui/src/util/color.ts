import tinycolor from 'tinycolor2';

export function rgbToInt(color: tinycolor.ColorFormats.RGB): number {
  return color.r * 65536 + color.g * 256 + color.b;
}

export function intToRgb(i: number): tinycolor.ColorFormats.RGB {
  return {
    r: Math.trunc(i / 65536),
    g: Math.trunc((i % 65536) / 256),
    b: i % 256,
  };
}

export function hexToInt(h: string): number {
  return rgbToInt(tinycolor(h).toRgb());
}

export function intToHex(i: number): string {
  return tinycolor(intToRgb(i)).toHex();
}
