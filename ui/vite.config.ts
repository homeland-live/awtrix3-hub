import { fileURLToPath, URL } from 'node:url';

import { defineConfig, splitVendorChunkPlugin } from 'vite'; // eslint-disable-line import/no-extraneous-dependencies
import vue from '@vitejs/plugin-vue'; // eslint-disable-line import/no-extraneous-dependencies

// https://vite.dev/config/
export default defineConfig({
  base: '/ui/',
  plugins: [vue(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
