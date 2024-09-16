import { CircleAlert } from "lucide-react";

export const FieldError = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-red-500 text-sm font-medium flex flex-row gap-1 items-center">
      <CircleAlert className="fill-red-500 text-white" size={14} />
      {children}
    </p>
  );
};
