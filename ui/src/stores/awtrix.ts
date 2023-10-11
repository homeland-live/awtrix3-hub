import { defineStore } from 'pinia';
import {
  getStats,
  type Stats,
  getSettings,
  type Settings,
  toggleDisplay,
  updateSettings,
  getLatestRelease,
  type Release,
  reboot,
} from '@/api/awtrix';
import { LocalStore } from '@/util/store';

export type State = {
  ipv4: string | undefined,
  stats: Stats | undefined,
  settings: Settings | undefined,
  release: Release | undefined,
  liveViewEnabled: boolean,
  initialized: boolean,
  isLoading: boolean,
};

export const BRIGHTNESS_MIN = 0;
export const BRIGHTNESS_MAX = 255;

const ls = new LocalStore('awtrix');

export const useAwtrixStore = defineStore({
  id: 'awtrix',
  state: (): State => ({
    ipv4: undefined,
    stats: undefined,
    settings: undefined,
    release: undefined,
    liveViewEnabled: false,
    initialized: false,
    isLoading: false,
  }),
  getters: {
    isDisplayOn(state): boolean {
      return state.settings?.MATP === true;
    },
    hasStats(state): boolean {
      return !!state.stats && !state.stats.error && Object.keys(state.stats).length > 1;
    },
    hasSettings(state): boolean {
      return !!state.settings && !state.settings.error && Object.keys(state.settings).length > 1;
    },
  },
  actions: {
    init(ipv4: string): Promise<void> {
      if (this.initialized) {
        return Promise.resolve();
      }
      this.ipv4 = ipv4;
      this.initialized = true;
      this.isLoading = true;
      return Promise.all([
        getStats(this.ipv4),
        getSettings(this.ipv4),
        getLatestRelease(),
      ]).then(([stats, settings, releaseResp]) => {
        this.isLoading = false;
        this.stats = stats;
        this.settings = settings;
        if (releaseResp.release) {
          this.release = releaseResp.release;
        }
      }).then(() => {
        this.liveViewEnabled = ls.readB('liveViewEnabled');
      });
    },
    reload(ipv4?: string): Promise<void> {
      this.$reset();
      if (!ipv4) {
        return Promise.resolve();
      }
      return this.init(ipv4);
    },
    toggleDisplay(): Promise<boolean> {
      if (!this.hasSettings || !this.ipv4) {
        return Promise.resolve(false);
      }
      return toggleDisplay(this.ipv4, !this.isDisplayOn)
        .then((success) => {
          if (success && this.hasSettings) {
            (this.settings as Settings).MATP = !(this.settings as Settings).MATP;
          }
          return success;
        });
    },
    toggleLiveView(): void {
      this.liveViewEnabled = !this.liveViewEnabled;
      ls.writeB('liveViewEnabled', this.liveViewEnabled);
    },
    setBrightness(value: number): Promise<boolean> {
      if (!this.hasSettings || !this.ipv4) {
        return Promise.resolve(false);
      }
      return updateSettings(this.ipv4, { BRI: value })
        .then((success) => {
          if (success && this.hasSettings) {
            (this.settings as Settings).BRI = value;
          }
          return success;
        });
    },
    toggleAutoBrightness(): Promise<boolean> {
      if (!this.hasSettings || !this.ipv4) {
        return Promise.resolve(false);
      }
      return updateSettings(this.ipv4, { ABRI: !(this.settings as Settings).ABRI })
        .then((success) => {
          if (success && this.hasSettings) {
            (this.settings as Settings).ABRI = !(this.settings as Settings).ABRI;
          }
          return success;
        });
    },
    reboot(): Promise<boolean> {
      if (!this.ipv4) {
        return Promise.resolve(false);
      }
      return reboot(this.ipv4);
    },
  },
});
