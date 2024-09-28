"use client";

import { getLesson } from "@/actions/courses/courses.action";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SelectChallenge } from "@/components/units/select-challenge-component";
import { clientStore } from "@/store/user-store";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LessonHeader } from "@/components/units/lesson-header";
import { AnimatePresence } from "framer-motion";
import { LessonComplete } from "@/components/units/lesson-complete-component";

export default function Page() {
  const { lessonId, isPreviousChallengeCompleting } = clientStore();

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
      <AnimatePresence>
        {data.map((challenge, index) => (
          <SelectChallenge
            isPreviousChallengeCompleting={isPreviousChallengeCompleting}
            index={index}
            length={data.length}
            key={challenge.id}
            challenge={challenge}
          />
        ))}
        <LessonComplete challengeLength={data.length} />
      </AnimatePresence>
    </main>
  );
}
