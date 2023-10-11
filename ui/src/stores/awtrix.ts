import { defineStore } from 'pinia';
import {
  getStats,
  type Stats,
  getSettings,
  type Settings,
  updateSettings,
  getLatestRelease,
  type Release,
  reboot,
} from '@/api/awtrix';
import { LocalStore } from '@/util/store';

export type State = {
  ipv4: string | undefined,
  stats: Partial<Stats>,
  settings: Partial<Settings>,
  release: Release | undefined,
  liveViewEnabled: boolean,
  initialized: boolean,
  isLoading: boolean,
};

export const BRIGHTNESS_MIN = 0;
export const BRIGHTNESS_MAX = 255;

const ls = new LocalStore('awtrix');

type PickProps<T, TFilter> = { [K in keyof T as (T[K] extends TFilter ? K : never)]: T[K] }

export const useAwtrixStore = defineStore({
  id: 'awtrix',
  state: (): State => ({
    ipv4: undefined,
    stats: {},
    settings: {},
    release: undefined,
    liveViewEnabled: false,
    initialized: false,
    isLoading: false,
  }),
  getters: {
    hasStats(state): boolean {
      return !state.stats.error && Object.keys(state.stats).length > 1;
    },
    hasSettings(state): boolean {
      return !state.settings.error && Object.keys(state.settings).length > 1;
    },
    isDisplayOn(state): boolean {
      return state.settings?.MATP === true;
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
    setSetting(key: keyof Settings, value: string | number | boolean): Promise<boolean> {
      if (!this.hasSettings || !this.ipv4) {
        return Promise.resolve(false);
      }
      return updateSettings(this.ipv4, { [key]: value })
        .then((success) => {
          if (success && this.hasSettings) {
            this.settings = { ...this.settings, [key]: value };
            return true;
          }
          return false;
        });
    },
    toggleSetting(key: keyof PickProps<Settings, boolean>): Promise<boolean> {
      return this.setSetting(key, !this.settings[key]);
    },
    toggleDisplay(): Promise<boolean> {
      return this.toggleSetting('MATP');
    },
    toggleLiveView(): void {
      this.liveViewEnabled = !this.liveViewEnabled;
      ls.writeB('liveViewEnabled', this.liveViewEnabled);
    },
    setBrightness(value: number): Promise<boolean> {
      return this.setSetting('BRI', value);
    },
    toggleAutoBrightness(): Promise<boolean> {
      return this.toggleSetting('ABRI');
    },
    reboot(): Promise<boolean> {
      if (!this.ipv4) {
        return Promise.resolve(false);
      }
      return reboot(this.ipv4);
    },
  },
});
