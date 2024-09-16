"use client";

import { getUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { localDate } from "@/lib/date";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: { slug: string } }) {
  const { data, isPending } = useQuery<User>({
    queryKey: ["user"],
  });

  const router = useRouter();

  const {
    data: profileData,
    isPending: isProfilePending,
    refetch,
  } = useQuery({
    queryKey: ["profile", params.slug],
    queryFn: async () => {
      if (data!.name !== params.slug) {
        return await getUser(params.slug);
      } else {
        return data;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (data?.id != undefined) {
      refetch();
    }
  }, [data, refetch]);

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (isProfilePending || !profileData) {
    return <LoadingOverlay />;
  }

  if (profileData.id == 0) {
    router.push("/not-found");
    return null;
  }

  return (
    <div className="flex flex-row flex-1 p-2 px-12 gap-6">
      <section className="flex-1">
        <h1 className="text-3xl font-extrabold text-zinc-700">
          {profileData.name}
        </h1>
        <p className="text-zinc-600">
          Приєднався: {localDate(profileData.joinedAt)}
        </p>
        <div className="h-[2px] bg-zinc-100 w-full my-6" />
        <h2 className="text-zinc-700 font-extrabold text-2xl mb-2">
          Статистика
        </h2>
        <div className="flex flex-row flex-1 gap-2 flex-wrap">
          <div className="card px-4 py-2 border-zinc-100 border-2 rounded-xl flex-1 max-w-[300px]">
            <p className="text-zinc-600 font-extrabold text-xl">
              {profileData.score}
            </p>
            <p className="font-medium text-zinc-500">Усього балів</p>
          </div>
        </div>
      </section>
      <aside className="w-[240px] h-screen bg-zinc-100 flex items-center justify-center rounded-lg">
        <h2 className="text-zinc-400 font-medium text-xs">
          achievements widget
        </h2>
      </aside>
    </div>
  );
}
