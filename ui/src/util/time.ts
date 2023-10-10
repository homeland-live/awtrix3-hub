import ago from 's-ago';

export function secondsSince(time: string): number {
  return (Date.now() - Date.parse(time)) / 1000;
}

export function getRelativeTime(time: string): string {
  return ago(new Date(time));
}

export function fmtSeconds(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisp = d > 0 ? `${d}d ` : '';
  const hDisp = h > 0 ? `${h}h ` : '';
  const mDisp = m > 0 ? `${m}m ` : '';
  const sDisp = `${s}s`;

  return dDisp + hDisp + mDisp + sDisp;
}

const OneSec = 1000;
const OneMin = 60 * OneSec;

export type AgoTimerCallbackFn = (timeago: string, interval: number) => void;

export class AgoTimer {
  date: string | undefined;

  fn: AgoTimerCallbackFn;

  interval: number;

  id: number;

  constructor(date: string | undefined, fn: AgoTimerCallbackFn) {
    this.date = date;
    this.fn = fn;
    this.interval = 5 * OneSec;
    this.id = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  getInterval(elapsed: number): number { // in miliseconds
    if (elapsed < OneMin) return 5 * OneSec;
    if (elapsed < 2 * OneMin) return 10 * OneSec;
    if (elapsed < 5 * OneMin) return 20 * OneSec;
    if (elapsed < 10 * OneMin) return 30 * OneSec;
    return OneMin;
  }

  tick(): void {
    if (!this.date) {
      return;
    }
    const elapsed = Date.parse(this.date) - Date.now();
    const interval = this.getInterval(Math.abs(elapsed));
    if (this.interval !== interval) {
      this.interval = interval;
      this.restart(true);
    }

    this.fn(getRelativeTime(this.date), this.interval);
  }

  start(skipTick = false): void {
    if (!this.date) {
      return;
    }
    if (!skipTick) {
      this.tick();
    }
    this.id = window.setInterval(this.tick.bind(this), this.interval);
  }

  stop(): void {
    clearInterval(this.id);
    this.id = 0;
  }

  restart(skipTick = false): void {
    this.stop();
    if (!this.date || this.date === '') {
      return;
    }
    this.start(skipTick);
  }

  update(date: string | undefined): void {
    if (date === this.date) {
      return;
    }
    this.date = date;
    this.restart();
  }
}
