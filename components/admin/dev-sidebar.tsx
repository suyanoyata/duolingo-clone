"use client";

import { useQuery } from "@tanstack/react-query";
import { SidebarLink } from "@/components/sidebar-link";
import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useRouter } from "next/navigation";
import { FlaskConical, Settings, User } from "lucide-react";

export const DevSidebar = () => {
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

  if (data.isAdmin == false) {
    return router.push("/learn") as unknown as React.ReactNode;
  }

  return (
    <>
      <div className="fixed top-0 left-0 border-r-2 border-zinc-100 w-[240px] max-sm:hidden flex h-screen px-3 py-2 flex-col flex-shrink-0 bg-white">
        <h1 className="text-4xl font-extrabold text-zinc-800 select-none mb-3">
          fluenty
        </h1>
        <div className="flex flex-col gap-2">
          <SidebarLink href="/dashboard/courses">
            <FlaskConical />
            Курси
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
