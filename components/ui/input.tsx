import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-[2px]">
        {props.label && (
          <label
            htmlFor={props.label}
            className="font-bold text-slate-700 text-base select-none"
          >
            {props.label}
          </label>
        )}
        <input
          id={props.label}
          type={type}
          autoComplete="off"
          className={cn(
            "flex h-9 w-full rounded-md border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "bg-slate-50 border-slate-200 text-base text-slate-800 font-medium rounded-xl border-[1.5px] focus:border-sky-500",
            className,
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
