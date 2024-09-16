"use client";

import { useQuery } from "@tanstack/react-query";
import { SidebarLink } from "./sidebar-link";
import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "./loading-overlay";

export const Sidebar = () => {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getCurrentUser(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isPending || !data) {
    return <LoadingOverlay />;
  }

  return (
    <div className="fixed top-0 left-0 border-r-2 border-zinc-100 w-[240px] max-sm:hidden flex h-screen px-3 py-2 flex-col flex-shrink-0 bg-white">
      <h1 className="text-4xl font-extrabold text-zinc-800 select-none mb-3">
        fluenty
      </h1>
      <div className="flex flex-col gap-2">
        <SidebarLink href="/learn">Навчатись</SidebarLink>
        <SidebarLink href={`/profile/${data.name}`}>Профіль</SidebarLink>
      </div>
    </div>
  );
};
