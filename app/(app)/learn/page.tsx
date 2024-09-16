"use client";

import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SelectCourse } from "@/components/select-course";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getCurrentUser(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const router = useRouter();

  const RenderBlock = () => {
    if (isPending || !data) {
      return <LoadingOverlay />;
    }

    if (isError) {
      router.push("/");
      return <LoadingOverlay />;
    }

    return (
      <div className="p-2">
        <h1 className="text-3xl font-extrabold text-zinc-700 mb-2">
          Оберіть курс для проходження
        </h1>
        <SelectCourse />
      </div>
    );
  };

  return (
    <div className="flex-1">
      <RenderBlock />
    </div>
  );
}
