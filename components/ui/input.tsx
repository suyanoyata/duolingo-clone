import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-[2px]">
        {props.label && (
          <label
            htmlFor={props.label}
            className="font-bold text-zinc-700 text-base select-none"
          >
            {props.label}
          </label>
        )}
        <input
          id={props.label}
          type={type}
          autoComplete="off"
          className={cn(
            "flex h-11 w-full rounded-md border-input px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "bg-zinc-100 border-zinc-200 text-base text-zinc-800 font-medium rounded-xl border-[1.5px] focus:border-sky-500",
            className,
            error && "border-red-500",
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
