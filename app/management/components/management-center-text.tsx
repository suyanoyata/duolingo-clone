import { cn } from "@/lib/utils";

export const ManagementCenterText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "absolute top-[50%] left-[50%] translate-x-[-50%] text-sm text-slate-800 font-medium",
        ...(className ?? ""),
      )}
    >
      {children}
    </p>
  );
};
