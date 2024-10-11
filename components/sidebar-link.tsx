"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarLink = ({
  className,
  children,
  href,
}: {
  className?: string;
  children?: React.ReactNode;
  href: string;
}) => {
  const pathname = usePathname();
  const isFocused = pathname.startsWith(href);

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "justify-start text-base flex gap-2",
        isFocused &&
          "bg-sky-50 outline outline-2 outline-sky-200 text-sky-500 max-sm:outline-none max-sm:bg-transparent",
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};
