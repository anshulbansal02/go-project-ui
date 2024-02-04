import clsx from "clsx";
import { Toast as ToastType } from "@/store/toaster";

import styles from "./toast.module.scss";
import { SvgXBold } from "@/assets/icons";

interface ToastProps extends ToastType {
  onDismiss: (id: number) => void;
  className?: string;
}

export function Toast({
  id,
  title,
  content,
  icon,
  dismissible = true,
  onDismiss,
  className,
}: ToastProps) {
  return (
    <div className={clsx(styles.container, styles[className ?? ""])}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.body} style={{ paddingLeft: icon ? 0 : "1.6rem" }}>
        {title && <h4 className={styles.title}>{title}</h4>}
        {content}
      </div>

      {dismissible && (
        <button className={styles.dismiss} onClick={() => onDismiss(id)}>
          <SvgXBold width={16} height={16} />
        </button>
      )}
    </div>
  );
}
