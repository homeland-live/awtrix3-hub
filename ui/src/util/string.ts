// maskRight replaces string symbols after n with "*"
export function maskRight(s: string, n: number): string {
  if (n >= s.length) {
    return s;
  }
  return s.substring(0, n) + '*'.repeat(s.length - n);
}

// maskLeft replaces string symbols before n with "*"
export function maskLeft(s: string, n: number): string {
  if (n === 0) {
    return s;
  }

  const pos = s.length - n;
  if (pos <= 0) {
    return s;
  }
  return '*'.repeat(pos) + s.substring(pos);
}

// mask replaces the whole string with "*"
export function mask(s: string): string {
  return '*'.repeat(s.length);
}
