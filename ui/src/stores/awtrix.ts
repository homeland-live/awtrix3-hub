import { defineStore } from 'pinia';
import {
  getStats,
  type Stats,
  getSettings,
  type Settings,
  toggleDisplay,
} from '@/api/awtrix';

export type State = {
  ipv4: string | undefined,
  stats: Stats | undefined,
  settings: Settings | undefined,
  initialized: boolean,
  isLoading: boolean,
};

export const useAwtrixStore = defineStore({
  id: 'awtrix',
  state: (): State => ({
    ipv4: undefined,
    stats: undefined,
    settings: undefined,
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
      ]).then(([stats, settings]) => {
        this.isLoading = false;
        this.stats = stats;
        this.settings = settings;
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
  },
});
