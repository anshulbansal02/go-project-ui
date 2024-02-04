import { create } from "zustand";

export type Toast = {
  id: number;
  title?: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: (id: Toast["id"]) => void;
};

export type ToasterState = {
  toasts: Toast[];
  nextToastId: number;
};

const initialState: ToasterState = {
  toasts: [],
  nextToastId: 0,
};

const toasterStore = create<ToasterState>()(() => initialState);

export function useToastList() {
  return toasterStore().toasts;
}

export function getToastList() {
  return toasterStore().toasts;
}

export function addToast(toast: Toast) {
  toasterStore.setState(({ toasts }) => {
    return { toasts: [...toasts, toast] };
  });
}

export function removeToast(toastId: Toast["id"]) {
  toasterStore.setState(({ toasts }) => {
    return { toasts: toasts.filter((t) => t.id !== toastId) };
  });
}

export function generateToastId() {
  toasterStore.setState((store) => ({ nextToastId: ++store.nextToastId }));
  return toasterStore.getState().nextToastId;
}
