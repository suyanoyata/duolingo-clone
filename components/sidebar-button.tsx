"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon } from "lucide-react";

export const SidebarButtonTrigger = () => {
  const { toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <Button size="sm" onClick={() => toggleSidebar()} variant="ghost" className="ml-3">
      <SidebarIcon />
    </Button>
  );
};
