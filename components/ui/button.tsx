import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "select-none inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 border-2 border-b-[4px] active:border-b-[2px]",
        primary:
          "bg-green-400 text-primary-foreground hover:bg-green-400/90 border-green-500 border-b-4 active:border-b-0",
        secondary:
          "bg-blue-400 text-primary-foreground hover:bg-blue-400/90 border-blue-500 border-b-4 active:border-b-0",
        destructive:
          "bg-red-400 text-primary-foreground hover:bg-red-400/90 border-red-500 border-b-4 active:border-b-0",
        game: "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 border-2 border-b-[4px] active:border-b-[2px] normal-case text-base",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        icon: "h-9 w-9",
        rounded: "rounded-full px-4 py-1 h-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
