"use client";

import { getLesson } from "@/actions/courses/courses.action";

import { clientStore } from "@/store/user-store";
import { User } from "@prisma/client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { LoadingOverlay } from "@/components/loading-overlay";
import { LessonHeader } from "@/components/units/lesson-header";

import { NoHeartsLeftModal } from "@/components/units/no-hearts-left-modal";
import { LessonComplete } from "@/components/units/lesson-complete-component";

import { SelectChallenge } from "@/components/units/select-challenge-component";
import { SelectImageChallenge } from "@/components/units/select-image-challenge-component";
import { SentenceChallenge } from "@/components/units/sentence-challenge-component";

export default function Page() {
  const { lessonId, isPreviousChallengeCompleting } = clientStore();

  const router = useRouter();

  const { data: user, isPending: isUserPending } = useQuery<User>({
    queryKey: ["user"],
  });

  const [localUser, setLocalUser] = useState<User | null>(null);

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
              isPreviousChallengeCompleting={isPreviousChallengeCompleting}
              index={index}
              key={index}
              challenge={challenge}
            />
            <SentenceChallenge
              lessonId={lessonId}
              index={index}
              key={index}
              challenge={challenge}
            />
            <SelectImageChallenge
              lessonId={lessonId}
              isPreviousChallengeCompleting={isPreviousChallengeCompleting}
              index={index}
              key={index}
              challenge={challenge}
            />
          </>
        ))}
        <LessonComplete
          isPreviousChallengeCompleting={isPreviousChallengeCompleting!}
          challengeLength={data.length}
        />
      </AnimatePresence>
    </main>
  );
}
