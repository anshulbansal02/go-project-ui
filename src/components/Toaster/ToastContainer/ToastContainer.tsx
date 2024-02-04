import styles from "./toast-container.module.scss";

import { createPortal } from "react-dom";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import { Toast } from "../Toast/Toast";
import { removeToast, useToastList } from "@/store/toaster";

const animationConfig = {
  toast: {
    layout: true,
    initial: { y: -56, scale: 0.9 },
    animate: { y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.7, transition: { duration: 0.1 } },
  },
};

export function ToastContainer() {
  const toasts = useToastList();

  return createPortal(
    <div className={styles.container}>
      <div className={clsx(styles.stack, styles.bottom, styles.middle)}>
        <AnimatePresence>
          {toasts.map((toastConfig) => (
            <motion.div key={toastConfig.id} {...animationConfig.toast}>
              <Toast
                {...toastConfig}
                onDismiss={(id) => {
                  removeToast(id);
                  toastConfig.onDismiss && toastConfig.onDismiss(id);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>,
    document.getElementById("portal") as HTMLElement
  );
}
