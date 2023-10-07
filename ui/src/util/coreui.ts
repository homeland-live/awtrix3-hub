import type * as coreui from '@/types/coreui';

export function getVersion(): string {
  return window.coreui.Modal.VERSION;
}

export function collapse(e: Element, opts: coreui.CollapseOpts = {}): coreui.CollapseInstance {
  return new window.coreui.Collapse(e, opts);
}

export function getCollapseInstance(e: Element): coreui.CollapseInstance {
  return window.coreui.Collapse.getInstance(e);
}

export function modal(e: Element, opts: coreui.ModalOpts = {}): coreui.ModalInstance {
  return new window.coreui.Modal(e, opts);
}

export function getModalInstance(e: Element): coreui.ModalInstance {
  return window.coreui.Modal.getInstance(e);
}
