/// <reference types="vite/client" />

interface CoreUI {
  Collapse: import('@/types/coreui').CollapseConstructor;
  Modal: import('@/types/coreui').ModalConstructor;
}

declare interface Window {
  coreui: CoreUI;
}
