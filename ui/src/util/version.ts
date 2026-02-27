export function gt(a: string, b: string): boolean {
  const aParts = a.split('.').map((s) => parseInt(s, 10));
  const bParts = b.split('.').map((s) => parseInt(s, 10));
  if (aParts.length !== bParts.length) {
    return false;
  }
  for (let i = 0; i < aParts.length; i += 1) {
    if ((aParts[i] || 0) > (bParts[i] || 0)) {
      return true;
    }
  }
  return false;
}
