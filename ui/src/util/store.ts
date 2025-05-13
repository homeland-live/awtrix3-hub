export class LocalStore {
  ns: string;

  constructor(ns: string) {
    this.ns = ns;
  }

  key(name: string): string {
    return [this.ns, name].join('.');
  }

  readS(name: string, defaultValue = ''): string {
    return localStorage.getItem(this.key(name)) || defaultValue;
  }

  writeS(name: string, value: string) {
    localStorage.setItem(this.key(name), value);
  }

  readB(name: string, defaultValue = false): boolean {
    const b = this.readS(name);
    if (!b) {
      return defaultValue;
    }
    return b === '1';
  }

  writeB(name: string, value: boolean) {
    this.writeS(name, value ? '1' : '0');
  }

  readA(name: string, defaultValue = []): Array<string> {
    const a = this.readS(name);
    if (!a) {
      return defaultValue;
    }
    return JSON.parse(a) as Array<string>;
  }

  writeA(name: string, value: Array<string>) {
    this.writeS(name, JSON.stringify(value));
  }
}
