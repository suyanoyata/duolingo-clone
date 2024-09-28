"use client";

import { useQuery } from "@tanstack/react-query";
import { SidebarLink } from "./sidebar-link";
import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "./loading-overlay";
import { useRouter } from "next/navigation";
import { GraduationCap, User } from "lucide-react";

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
      <div className="fixed top-0 left-0 border-r-2 border-zinc-100 w-[240px] max-sm:hidden flex h-screen px-3 py-2 flex-col flex-shrink-0 bg-white">
        <h1 className="text-4xl font-extrabold text-zinc-800 select-none mb-3">
          fluenty
        </h1>
        <div className="flex flex-col gap-2">
          <SidebarLink href="/learn">
            <GraduationCap />
            Навчатись
          </SidebarLink>
          <SidebarLink href={`/profile/${data.name}`}>
            <User />
            Профіль
          </SidebarLink>
        </div>
      </div>
      <div className="hidden h-screen border-r-2 border-zinc-100 w-16 flex-col gap-2 py-2 flex-shrink-0">
        <SidebarLink className="w-[44px] h-[44px]" href="/learn">
          <GraduationCap />
        </SidebarLink>
        <SidebarLink
          className="w-[44px] h-[44px]"
          href={`/profile/${data.name}`}
        >
          <User />
        </SidebarLink>
      </div>
    </>
  );
};
