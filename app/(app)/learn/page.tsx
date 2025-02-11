"use client";

import { getCurrentUser } from "@/actions/users/user.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SelectCourse } from "@/components/courses/select-course";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clientStore } from "@/store/user-store";
import { useEffect } from "react";

export default function Page() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getCurrentUser(),
  });

  const router = useRouter();

  const { lessonId, setLessonId, setCurrentChallengeIndex } = clientStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ["lesson", lessonId],
    });
    setLessonId(0);
    setCurrentChallengeIndex(0);
  }, [lessonId, setLessonId, queryClient, setCurrentChallengeIndex]);

  const RenderBlock = () => {
    if (isPending || !data) {
      return <LoadingOverlay />;
    }

    if (isError) {
      return router.push("/") as unknown as React.ReactNode;
    }

    return (
      <div>
        <h1 className="text-3xl max-sm:text-2xl font-extrabold text-zinc-700 mb-2">
          Оберіть мову для вивчення
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
