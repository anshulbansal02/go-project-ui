import { useCallback } from "react";

import { defaultToastStyles } from "@/components/Toaster";
import {
  Toast,
  addToast,
  generateToastId,
  getToastList,
  removeToast,
} from "@/store/toaster";

interface ToastConfig extends Toast {
  timeout?: number;
  persistent?: boolean;
}

const DEFAULT_TIMEOUT = 2500; // 2.5 seconds

export function useToaster() {
  const make = useCallback((defaultConfig: Partial<ToastConfig>) => {
    return (toastProps: Omit<ToastConfig, "id"> | string) => {
      let config = defaultConfig;
      if (typeof toastProps === "string") config.title = toastProps;
      else config = { ...config, ...toastProps };

      config.id = generateToastId();

      if (!config.persistent) {
        setTimeout(() => {
          removeToast(config.id!);
        }, config.timeout ?? DEFAULT_TIMEOUT);
      }
      addToast(config as Toast);

      return config.id;
    };
  }, []);

  const methods = {
    toast: make({}),
    error: make(defaultToastStyles.error),
    dismiss: dismissToast,
  };

  return methods;
}

export function dismissToast(toastId: Toast["id"]) {
  const toasts = getToastList();

  const toast = toasts.find((t: Toast) => t.id === toastId);
  if (toast) {
    removeToast(toastId);
    if (toast?.onDismiss) toast.onDismiss(toastId);
  }
}
