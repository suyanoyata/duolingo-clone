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
import { useEffect, useState } from "react";
import { NoHeartsLeftModal } from "@/components/units/no-hearts-left-modal";
import { SentenceChallenge } from "@/components/units/sentence-challenge-component";
import { SelectImageChallenge } from "@/components/units/select-image-challenge-component";

export default function Page() {
  const { lessonId, isPreviousChallengeCompleting } = clientStore();

  const router = useRouter();

  const { data: user, isPending: isUserPending } = useQuery<User>({
    queryKey: ["user"],
  });

  const [localUser, setLocalUser] = useState<User | null>(null);

  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => await getLesson(lessonId),
  });

  useEffect(() => {
    if (localUser && localUser.hearts !== 0 && user!.hearts == 0) {
      setShowModal(true);
    }

    setLocalUser(user!);
  }, [user, localUser]);

  if (lessonId == 0) {
    if (typeof window != "undefined") {
      router.push("/learn");
    }
    return <LoadingOverlay />;
  }

  if (isPending || !data || isUserPending || !user) {
    return <LoadingOverlay />;
  }

  return (
    <main className="max-w-[700px] mx-auto p-2">
      <LessonHeader length={data.length} user={user} />
      <NoHeartsLeftModal open={showModal} setOpen={setShowModal} />
      <AnimatePresence>
        {data.map((challenge, index) => (
          <>
            <SelectChallenge
              lessonId={lessonId}
              setCompleted={setCompleted}
              isPreviousChallengeCompleting={isPreviousChallengeCompleting}
              index={index}
              length={data.length}
              key={index}
              challenge={challenge}
            />
            <SentenceChallenge
              lessonId={lessonId}
              setCompleted={setCompleted}
              index={index}
              length={length}
              key={index}
              challenge={challenge}
            />
            <SelectImageChallenge
              lessonId={lessonId}
              setCompleted={setCompleted}
              isPreviousChallengeCompleting={isPreviousChallengeCompleting}
              index={index}
              length={data.length}
              key={index}
              challenge={challenge}
            />
          </>
        ))}
        <LessonComplete
          isPreviousChallengeCompleting={isPreviousChallengeCompleting!}
          completed={completed}
          challengeLength={data.length}
        />
      </AnimatePresence>
    </main>
  );
}
