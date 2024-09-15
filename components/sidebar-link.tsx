"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarLink = ({
  children,
  href,
}: {
  children?: React.ReactNode;
  href: string;
}) => {
  const pathname = usePathname();
  const isFocused = pathname === href;

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "justify-start",
        isFocused && "bg-sky-50 outline outline-2 outline-sky-200 text-sky-400",
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};
