import { cloneElement, useContext } from "react";

import { ModalContext } from "./Modal";

interface TriggerProps {
  children: React.ReactElement;
}
function Trigger({ children }: TriggerProps) {
  const { toggleCallback } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      toggleCallback(true);
    },
  });
}

export default Trigger;
