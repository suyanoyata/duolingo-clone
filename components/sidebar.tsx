"use client";

import { useQuery } from "@tanstack/react-query";
import { SidebarLink } from "./sidebar-link";
import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "./loading-overlay";
import { useRouter } from "next/navigation";
import { GraduationCap, Settings, User } from "lucide-react";

export const Sidebar = () => {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getCurrentUser(),
    enabled: true,
  });

  const router = useRouter();

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (!data) {
    return router.push("/") as unknown as React.ReactNode;
  }

  return (
    <>
      <div className="max-sm:flex hidden h-14 bg-zinc-100 w-full fixed bottom-0 items-center justify-around border-t-2">
        <SidebarLink href="/learn" className="flex-col">
          <GraduationCap />
        </SidebarLink>
        <SidebarLink href={`/profile/${data.nickname}`}>
          <User />
        </SidebarLink>
        <SidebarLink href="/settings">
          <Settings />
        </SidebarLink>
      </div>
      <div className="fixed top-0 left-0 border-r-2 border-zinc-100 w-[240px] max-sm:hidden flex h-screen px-3 py-2 flex-col flex-shrink-0 bg-white">
        <h1 className="text-4xl font-extrabold text-zinc-800 select-none mb-3">
          fluenty
        </h1>
        <div className="flex flex-col gap-2">
          <SidebarLink href="/learn">
            <GraduationCap />
            Навчатись
          </SidebarLink>
        </div>
        <div className="mt-auto space-y-2">
          <SidebarLink href="/settings">
            <Settings />
            Налаштування
          </SidebarLink>
          <SidebarLink href={`/profile/${data.nickname}`}>
            <User />
            Профіль
          </SidebarLink>
        </div>
      </div>
    </>
  );
};
