"use client";

import { LoadingOverlay } from "@/components/loading-overlay";
import { Logout } from "@/components/logout-button";
import { ChangeNickname } from "@/components/settings/change-nickname";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data, isPending } = useQuery<User>({
    queryKey: ["user"],
  });

  if (isPending || !data) {
    return <LoadingOverlay />;
  }

  return (
    <main className="p-2">
      <h1 className="text-3xl font-extrabold text-zinc-700 select-none">
        Налаштування
      </h1>
      <ChangeNickname nickname={data.nickname} />
      <div className="my-2 mt-3 h-[2px] bg-zinc-100 w-full" />
      <Logout />
    </main>
  );
}
