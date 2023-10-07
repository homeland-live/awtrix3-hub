/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface CoreUI {
  Collapse: import('@/types/coreui').CollapseConstructor;
  Modal: import('@/types/coreui').ModalConstructor;
}

declare interface Window {
  coreui: CoreUI;
}
