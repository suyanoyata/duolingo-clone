import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

export const FieldError = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn("text-red-500 text-sm font-medium flex flex-row gap-1 items-center", className)}
    >
      <CircleAlert className="fill-red-500 text-white" size={14} />
      {children}
    </p>
  );
};
