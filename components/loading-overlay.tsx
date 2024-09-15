import { Loader } from "lucide-react";

export const LoadingOverlay = () => {
  return (
    <div className="absolute left-0 top-0 bg-white w-full h-screen z-50 flex items-center justify-center flex-1">
      <Loader size={16} className="spin" color="#475569" strokeWidth={1.8} />
    </div>
  );
};

export const LoadingCircle = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader size={16} className="spin text-black" strokeWidth={1.8} />
    </div>
  );
};
