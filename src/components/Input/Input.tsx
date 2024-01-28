import clsx from "clsx";
import { forwardRef } from "react";

export interface InputProps extends React.ComponentProps<"input"> {}

export const Input = forwardRef(function Input(
  { className, ...props }: InputProps,
  ref: React.LegacyRef<HTMLInputElement>
) {
  return (
    <input
      ref={ref}
      className={clsx("h-[40px] p-2 border-slate-300 border-2", className)}
      {...props}
    />
  );
});
