"use client";

import { managementStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingOverlay } from "@/components/loading-overlay";
import { CreateChallenge } from "../components/create-challenge-modal";
import { getChallenges } from "@/actions/management/challenges";
import { ManagementCenterText } from "../components/management-center-text";
import { Lesson } from "@prisma/client";
import { Suspense } from "react";

function Challenges() {
  const params = useSearchParams();
  const id = parseInt(params.get("id") ?? "");

  const { selectedLanguage } = managementStore();

  const { data: lessons, isPending } = useQuery<Lesson[]>({
    queryKey: ["language-lessons", selectedLanguage],
    initialData: [],
  });

  const { data: challenges, isPending: isChallengesPending } = useQuery({
    queryKey: ["lesson-challenges", id],
    queryFn: async () => {
      if (!id) return [];
      const challenges = await getChallenges(id);
      return challenges;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 1,
  });

  const lesson = lessons?.find((lesson) => lesson.id == id);

  const router = useRouter();

  if (selectedLanguage == "") {
    router.push("/management/lessons");
  }

  const ChallengesBlock = () => {
    if (isPending && selectedLanguage != "") {
      return <LoadingOverlay />;
    }

    if (!lessons || (lessons.length == 0 && selectedLanguage == "")) {
      return <LoadingOverlay />;
    }

    if (!lesson) {
      return (
        <ManagementCenterText>This lesson was not found</ManagementCenterText>
      );
    }

    if (isChallengesPending) {
      return <LoadingOverlay />;
    }

    if (!challenges) {
      return (
        <ManagementCenterText>
          This lesson has no challenges
        </ManagementCenterText>
      );
    }

    return (
      <div>
        <div className="flex flex-row justify-between">
          <h1 className="text-slate-600 text-3xl max-md:text-xl font-extrabold">
            Challenges in{" "}
            <span className="text-slate-800">
              {lesson.order}. {lesson.name}
            </span>
          </h1>
          <CreateChallenge lesson={lesson.id} />
        </div>
        {challenges.map((challenge) => (
          <div key={challenge.id}>
            <p>{challenge.name}</p>
            {JSON.stringify(challenge)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="p-2 relative flex-1">
      <ChallengesBlock />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Challenges />
    </Suspense>
  );
}
