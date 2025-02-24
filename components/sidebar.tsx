"use client";

import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Settings, User } from "lucide-react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getCurrentUser(),
    enabled: true,
  });

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (!data) {
    return router.push("/") as unknown as React.ReactNode;
  }

  return (
    <ShadSidebar collapsible="offcanvas">
      <SidebarContent className="bg-white">
        <SidebarHeader>
          <h1 className="text-4xl font-extrabold text-zinc-800 select-none mb-3">fluenty</h1>
          <SidebarMenuButton
            asChild
            variant={pathname.startsWith("/learn") ? "focused" : "default"}
          >
            <Link href="/learn">
              <span>
                <GraduationCap />
              </span>
              Навчатись
            </Link>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent />
        <SidebarFooter className="space-y-1">
          <SidebarMenuButton asChild variant={pathname == "/settings" ? "focused" : "default"}>
            <Link href="/settings">
              <span>
                <Settings />
              </span>
              Налаштування
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            variant={pathname == `/profile/${data.nickname}` ? "focused" : "default"}
          >
            <Link href={`/profile/${data.nickname}`}>
              <span>
                <User />
              </span>
              Профіль
            </Link>
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarContent>
    </ShadSidebar>
  );
}
