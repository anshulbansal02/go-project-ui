import clsx from "clsx";

export interface ButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
}

export const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx("p-2 h-[40px] cursor-pointer bg-slate-200", className)}
      type='button'
      {...props}
    >
      {children}
    </button>
  );
};
