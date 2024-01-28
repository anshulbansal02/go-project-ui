"use client";

import { useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "./Modal";
import { motion, AnimatePresence, type AnimationProps } from "framer-motion";

import styles from "./modal.module.scss";

interface ContentProps {
  children: React.ReactNode;
}

const animationConfig: Record<string, AnimationProps> = {
  window: {
    initial: { opacity: 0.5, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: {
      opacity: 0,
      y: 5,
      transition: { duration: 0.2 },
    },
    transition: { duration: 0.2 },
  },
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.05 },
    },
    transition: { duration: 0.1 },
  },
};

function Content({ children }: ContentProps) {
  const { open, toggleCallback } = useContext(ModalContext);

  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trappedElement = trapRef.current;

    const focusableSelector =
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

    if (trappedElement) {
      const focusableElements = Array.from(
        document.querySelectorAll(focusableSelector)
      ).filter(
        (x) =>
          !new Set(trappedElement.querySelectorAll(focusableSelector)).has(x)
      );
      const currentTabIndices = focusableElements.map((el) => ({
        element: el,
        tabindex: el.getAttribute("tabindex"),
      }));

      focusableElements.forEach((el) => el.setAttribute("tabindex", "-1"));

      return () => {
        currentTabIndices.forEach(({ element, tabindex }) => {
          tabindex
            ? element.setAttribute("tabindex", tabindex)
            : element.removeAttribute("tabindex");
        });
      };
    }
  });

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={styles.container}>
          <motion.div
            {...animationConfig.backdrop}
            className={styles.backdrop}
            onClick={(e) => {
              if (e.target === e.currentTarget)
                toggleCallback(false, "outsideClick");
            }}
          />

          <motion.div
            {...animationConfig.window}
            className={styles.window}
            role='dialog'
            aria-modal
            ref={trapRef}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,

    document.body
  );
}

export default Content;
