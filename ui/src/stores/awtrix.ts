import { defineStore } from 'pinia';
import {
  getStats,
  type Stats,
  getSettings,
  type Settings,
  updateSettings,
  getStatus,
  type Status,
  getLatestRelease,
  type Release,
  reboot,
  resetSettings,
  type Err,
} from '@/api/awtrix';
import { LocalStore } from '@/util/store';
import { intToHex, hexToInt } from '@/util/color';

export type State = {
  isLoading: boolean,
  initialized: boolean,
  ipv4: string | undefined,
  stats: Partial<Stats>,
  settings: Partial<Settings>,
  status: Partial<Status>,
  release: Release | undefined,
  liveViewEnabled: boolean,
};

export const BRIGHTNESS_MIN = 0;
export const BRIGHTNESS_MAX = 255;
export const COLOR_DEFAULT_INT = 16777215;
export const COLOR_DEFAULT_HEX = 'ffffff';
export const TIME_APP_DEFAULT_MODE = 1;

const ls = new LocalStore('awtrix');

type PickProps<T, TFilter> = { [K in keyof T as (T[K] extends TFilter ? K : never)]: T[K] }

export const useAwtrixStore = defineStore({
  id: 'awtrix',
  state: (): State => ({
    isLoading: false,
    initialized: false,
    ipv4: undefined,
    stats: {},
    settings: {},
    status: {},
    release: undefined,
    liveViewEnabled: false,
  }),
  getters: {
    error(state): Err | undefined {
      return state.stats.error || state.settings.error || state.status.error;
    },
    hasStats(state): boolean {
      return !state.stats.error && Object.keys(state.stats).length > 1;
    },
    hasSettings(state): boolean {
      return !state.settings.error && Object.keys(state.settings).length > 1;
    },
    hasStatus(state): boolean {
      return !state.status.error && Object.keys(state.status).length > 1;
    },
    globalTextColorInt(state): number {
      const tcol = state.settings?.TCOL;
      return tcol !== undefined ? tcol : COLOR_DEFAULT_INT;
    },
    globalTextColorHex(): string {
      return intToHex(this.globalTextColorInt);
    },
    appTimeTextColorHex(state): string {
      // 0 means global text color
      return intToHex(state.settings?.TIME_COL || this.globalTextColorInt);
    },
    appDateTextColorHex(state): string {
      // 0 means global text color
      return intToHex(state.settings?.DATE_COL || this.globalTextColorInt);
    },
    appHumTextColorHex(state): string {
      // 0 means global text color
      return intToHex(state.settings?.HUM_COL || this.globalTextColorInt);
    },
    appTempTextColorHex(state): string {
      // 0 means global text color
      return intToHex(state.settings?.TEMP_COL || this.globalTextColorInt);
    },
    appBatTextColorHex(state): string {
      // 0 means global text color
      return intToHex(state.settings?.BAT_COL || this.globalTextColorInt);
    },
    calHeaderColorHex(state): string {
      const chcol = state.settings?.CHCOL;
      return chcol !== undefined ? intToHex(chcol) : this.globalTextColorHex;
    },
    calBodyColorHex(state): string {
      const cbcol = state.settings?.CBCOL;
      return cbcol !== undefined ? intToHex(cbcol) : this.globalTextColorHex;
    },
    calTextColorHex(state): string {
      const ctcol = state.settings?.CTCOL;
      return ctcol !== undefined ? intToHex(ctcol) : this.globalTextColorHex;
    },
    activeWeekdayColorHex(state): string {
      const wdca = state.settings?.WDCA;
      return wdca !== undefined ? intToHex(wdca) : this.globalTextColorHex;
    },
    inactiveWeekdayColorHex(state): string {
      const wdci = state.settings?.WDCI;
      return wdci !== undefined ? intToHex(wdci) : this.globalTextColorHex;
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
        getStatus(this.ipv4),
        getLatestRelease(),
      ]).then(([stats, settings, status, releaseResp]) => {
        this.isLoading = false;
        this.stats = stats;
        this.settings = settings;
        this.status = status;
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
    setColor(key: keyof Settings, value: string): Promise<boolean> {
      if (!this.hasSettings || !this.ipv4) {
        return Promise.resolve(false);
      }
      return updateSettings(this.ipv4, { [key]: value })
        .then((success) => {
          if (success && this.hasSettings) {
            this.settings = { ...this.settings, [key]: hexToInt(value) };
            return true;
          }
          return false;
        });
    },
    toggleSetting(key: keyof PickProps<Settings, boolean>): Promise<boolean> {
      return this.setSetting(key, !this.settings[key]);
    },
    toggleLiveView(): void {
      this.liveViewEnabled = !this.liveViewEnabled;
      ls.writeB('liveViewEnabled', this.liveViewEnabled);
    },
    reboot(): Promise<boolean> {
      if (!this.ipv4) {
        return Promise.resolve(false);
      }
      return reboot(this.ipv4);
    },
    resetSettings(): Promise<boolean> {
      if (!this.ipv4) {
        return Promise.resolve(false);
      }
      return resetSettings(this.ipv4);
    },
  },
});
