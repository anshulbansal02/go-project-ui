import { createContext, useCallback, useEffect, useState } from "react";
import Trigger from "./Trigger";
import Content from "./Content";

type ModalCloseReason =
  | "escapeKey"
  | "outsideClick"
  | "crossButton"
  | "backButton";

interface IModalContext {
  open: boolean;
  toggleCallback: (active: boolean, closeReason?: ModalCloseReason) => void;
}

export const ModalContext = createContext<IModalContext>({} as IModalContext);

interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, closeReason?: ModalCloseReason) => void;
  adaptable?: boolean;
  children: React.ReactNode;
}

function Modal(props: ModalProps) {
  // Uncontrolled state
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  const toggleCallback = useCallback(
    (active: boolean, closeReason?: ModalCloseReason) => {
      props.onOpenChange?.(active, closeReason);
      // If Modal is uncontrolled
      if (props.open == null) setOpen(active);
    },
    [props.open, props.onOpenChange]
  );

  // Handles 'Escape' key action
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") toggleCallback(false, "escapeKey");
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [toggleCallback]);

  return (
    <ModalContext.Provider value={{ open: props.open ?? open, toggleCallback }}>
      {props.children}
    </ModalContext.Provider>
  );
}

Modal.Trigger = Trigger;
Modal.Content = Content;

export { Modal };
