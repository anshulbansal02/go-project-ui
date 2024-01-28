"use client";

import { useEffect, useState, useRef, useId, forwardRef } from "react";
import { Input } from "@/components";
import clsx from "clsx";

export interface CodeInputProps {
  length?: number;
  charset?: Charset;
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  pasteParser?: (pastedText: string) => string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const Key = {
  BACKSPACE: "Backspace",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
} as const;

const charsetRegex = {
  alpha: /[a-zA-Z]/,
  alphanumeric: /[a-zA-Z0-9]/,
  numeric: /[0-9]/,
} as const;

type Charset = keyof typeof charsetRegex;

export const CodeInput = forwardRef(function CodeInput(
  {
    length = 4,
    charset = "numeric",
    onChange,
    value,
    pasteParser,
    className,
    disabled,
    autoFocus,
  }: CodeInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const id = useId();

  const [chars, setChars] = useState(() => value?.split("") || []);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Callback for on change
  useEffect(() => {
    const code = chars.join("");

    onChange?.call(null, { target: { value: code } });
  }, [chars]);

  // Handles paste event
  function handlePaste(e: React.ClipboardEvent) {
    const pastedText = e.clipboardData.getData("text");

    const parsed = (pasteParser?.call(null, pastedText) || pastedText)
      .slice(0, length)
      .split("");

    setChars(parsed);

    inputsRef.current[length - 1]?.focus();
  }

  function move(direction: "left" | "right", index: number) {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    const inputEl = inputsRef.current[newIndex];

    if (inputEl) {
      inputEl.focus();
      inputEl.setSelectionRange(0, 1);
    }
  }

  function handleKey(key: string, inputIndex: number) {
    const char = key;

    switch (key) {
      case Key.ARROW_LEFT:
        move("left", inputIndex);
        break;

      case Key.ARROW_RIGHT:
        move("right", inputIndex);
        break;

      case Key.BACKSPACE:
        if (inputsRef.current[inputIndex]?.value === "")
          move("left", inputIndex);
        else
          setChars((oldChars) => {
            const chars = [...oldChars];
            chars[inputIndex] = "";
            return chars;
          });
        break;

      default:
        if (char.match(charsetRegex[charset])) {
          setChars((oldChars) => {
            const chars = [...oldChars];
            chars[inputIndex] = char;
            return chars;
          });

          move("right", inputIndex);
        }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (
      e.metaKey ||
      e.key === "Unidentified" ||
      e.key === "Tab" ||
      e.key === "Enter"
    )
      return;
    e.preventDefault();

    const inputIndex = +(e.currentTarget.id.split("_").at(-1) as string);
    handleKey(e.key, inputIndex);
  }

  // To make it work on mobiles
  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    let key = e.currentTarget.value;
    key = key === "" ? "Backspace" : key;

    const inputIndex = +(e.currentTarget.id.split("_").at(-1) as string);
    handleKey(key, inputIndex);
  }

  return (
    <div className={clsx("flex gap-2", className)} ref={ref}>
      {[...Array(length)].map((_, i) => (
        <Input
          autoFocus={autoFocus && i === 0}
          className='w-12 text-center'
          key={`${id}_${i}`}
          id={`${id}_${i}`}
          maxLength={1}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          disabled={disabled}
          value={chars[i] ?? ""}
          onPaste={handlePaste}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onChange={() => {}}
        />
      ))}
    </div>
  );
});
