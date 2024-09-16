import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export const LoadingOverlay = () => {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 bg-white w-full h-screen z-50 flex items-center justify-center flex-1",
      )}
    >
      <Loader size={16} className="spin" color="#475569" strokeWidth={1.8} />
    </div>
  );
};

export const LoadingCircle = ({ className }: { className?: string }) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader
        size={16}
        className={cn("spin text-black", className)}
        strokeWidth={1.8}
      />
    </div>
  );
};
