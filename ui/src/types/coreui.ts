export interface CollapseOpts {
  toggle?: boolean;
}

export interface CollapseInstance {
  toggle(): void;
  show(): void;
  hide(): void;
  dispose(): void;
}

export interface CollapseConstructor {
  new (element: Element | null, opts: CollapseOpts): CollapseInstance;
  getInstance(element: Element | null): CollapseInstance;
  VERSION: string;
}

export interface ModalOpts {
  backdrop?: boolean | string;
  keyboard?: boolean;
  focus?: boolean;
}

export interface ModalInstance {
  toggle(): void;
  show(): void;
  hide(): void;
  dispose(): void;
  handleUpdate(): void;
}

export interface ModalConstructor {
  new (element: Element | null, opts: ModalOpts): ModalInstance;
  getInstance(element: Element | null): ModalInstance;
  VERSION: string;
}

export interface Toast {
  title: string;
  subtitle?: string;
  body: string;
  icon?: string;
  iconColor?: string;
}

export type EditableConfirmFn = () => void;

export type EditableRejectFn = (reason: string) => void;

export interface EditableChangeEvent<T> {
  value: T;
  oldValue: T;
  confirm: EditableConfirmFn;
  reject: EditableRejectFn;
}
