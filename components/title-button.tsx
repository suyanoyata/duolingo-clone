import { cn } from "@/lib/utils";

export const ButtonTitle = ({
  title,
  children,
  className,
  variant = "xp",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: "hearts" | "xp";
}) => {
  return (
    <div
      className={cn(
        "bg-orange-400 rounded-xl border-orange-400 border-2 text-center",
        variant == "hearts" && "border-red-500 bg-red-500",
        className,
      )}
    >
      <p className="text-xs text-white font-bold p-1.5 uppercase">{title}</p>
      <div className={cn("bg-white rounded-xl w-[180px]", className)}>
        <p
          className={cn(
            "font-extrabold py-8 text-orange-400",
            variant == "hearts" && "text-red-500",
          )}
        >
          {children}
        </p>
      </div>
    </div>
  );
};
