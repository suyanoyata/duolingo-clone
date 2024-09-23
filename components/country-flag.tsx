import { cn } from "@/lib/utils";
import Image from "next/image";

export const CountryFlag = ({
  code,
  size = 28,
  className,
}: {
  code: string;
  size?: number;
  className?: string;
}) => {
  return (
    <Image
      className={cn("rounded-sm shadow-sm", className)}
      src={`/flags/${code}.svg`}
      alt=""
      width={size}
      height={size}
    />
  );
};
