"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { usePathname, useRouter } from "next/navigation";
import { FlaskConical, Settings, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

export const DevSidebar = () => {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getCurrentUser(),
    enabled: true,
  });

  const router = useRouter();

  const pathname = usePathname();

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (!data) {
    return router.push("/") as unknown as React.ReactNode;
  }

  if (data.isAdmin == false) {
    return router.push("/learn") as unknown as React.ReactNode;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <h1 className="text-4xl font-extrabold text-zinc-800 select-none mb-3">fluenty</h1>
        <SidebarMenuButton
          asChild
          variant={pathname == "/dashboard/courses" ? "focused" : "default"}
        >
          <Link href="/dashboard/courses">
            <FlaskConical />
            <span>Курси</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter className="space-y-1">
        <SidebarMenuButton asChild variant={pathname == "/settings" ? "focused" : "default"}>
          <Link href="/settings">
            <Settings />
            <span>Налаштування</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          asChild
          variant={pathname == `/profile/${data.nickname}` ? "focused" : "default"}
        >
          <Link href={`/profile/${data.nickname}`}>
            <User />
            <span>Профіль</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
