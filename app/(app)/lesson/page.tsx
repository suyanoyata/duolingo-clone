"use client";

import { getLesson } from "@/actions/courses/courses.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SelectChallenge } from "@/components/units/select-challenge-component";
import { clientStore } from "@/store/user-store";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LessonHeader } from "@/components/units/lesson-header";

export default function Page() {
  const { lessonId } = clientStore();

  const router = useRouter();

  const { data: user, isPending: isUserPending } = useQuery<User>({
    queryKey: ["user"],
  });

  const { data, isPending } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => await getLesson(lessonId),
  });

  if (lessonId == 0) {
    router.push("/learn");
    return <LoadingOverlay />;
  }

  if (isPending || !data || isUserPending || !user) {
    return <LoadingOverlay />;
  }

  return (
    <main className="max-w-[700px] mx-auto p-2">
      <LessonHeader length={data.length} user={user} />
      {data.map((challenge, index) => (
        <SelectChallenge
          index={index}
          length={data.length}
          key={challenge.id}
          challenge={challenge}
        />
      ))}
    </main>
  );
}