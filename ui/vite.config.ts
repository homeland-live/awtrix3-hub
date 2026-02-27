import { fileURLToPath, URL } from 'node:url';
import { relative } from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import genDeps from './vite-plugin-gen-deps';

// https://vite.dev/config/
export default defineConfig({
  base: '/ui/',
  plugins: [
    vue(),
    vueDevTools(),
    genDeps({
      beautify: false,
      includeDevDeps: ['typescript', 'vite'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          const path = relative(__dirname, id);
          if (path.startsWith('node_modules/@coreui')) {
            return 'vendor-coreui';
          }
          if (path.startsWith('node_modules/bootstrap-icons')) {
            return 'vendor-icons';
          }
          if (path.startsWith('node_modules')) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
});
