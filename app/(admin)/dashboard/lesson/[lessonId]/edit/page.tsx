"use client";

import { Reorder, useDragControls } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getLesson } from "@/actions/courses/courses.action";
import { deleteChallenge, reorderChallenges } from "@/actions/admin/admin.actions";

import { LoadingOverlay } from "@/components/loading-overlay";
import { GripVertical, Trash2 } from "lucide-react";

import { useDebounce } from "@/hooks/useDebounce";

import { Challenge, ChallengeType, Select, Sentence } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CreateChallenge } from "@/components/admin/forms/create-challenge";
import { toast } from "sonner";
import { FieldError } from "@/components/ui/field-error";

// #region helper components
const DisplayText = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-zinc-600 font-semibold">{children}</p>;
};

const ChallengeDisplay = ({
  constraints,
  challenge,
  question,
}: {
  constraints: React.RefObject<HTMLDivElement>;
  challenge: Challenge;
  question: {
    label: string;
    question: string;
  };
}) => {
  const controls = useDragControls();

  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-challenge", challenge.id],
    mutationFn: async () => await deleteChallenge(challenge),
    onSuccess: (data) => {
      client.setQueryData(["lesson", challenge.lessonId], (prev: Challenge[]) => {
        return prev.filter((currentChallenge) => currentChallenge.id !== challenge.id);
      });

      if ("data" in data && data.data.hideLesson) {
        return toast.success("Завдання видалено", {
          description: "Цей урок було приховано, через відсутність завдань",
        });
      }

      toast.success("Завдання видалено");
    },
  });

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      dragConstraints={constraints}
      value={challenge}
      className="flex gap-2 select-none items-center z-10 bg-white p-2 rounded-md"
    >
      <Button
        onPointerDown={(e) => controls.start(e)}
        size="sm"
        variant="ghost"
        className="cursor-grab"
      >
        <GripVertical className="text-zinc-600 flex-shrink-0" />
      </Button>
      <div>
        <p className="text-sm text-zinc-400 font-semibold">{question.label}</p>
        <DisplayText>{question.question}</DisplayText>
      </div>
      <Button
        disabled={isPending}
        onClick={() => mutate()}
        variant="destructive"
        className="text-white ml-auto"
      >
        <Trash2 />
      </Button>
    </Reorder.Item>
  );
};

// #endregion

const getChallengeQuestion = (
  challenge: Challenge & {
    Select: Select[];
    SelectImage: {
      question: string;
    }[];
    Sentence: Sentence[];
  }
) => {
  switch (challenge?.type) {
    case ChallengeType.SELECT:
      return {
        question: challenge.Select[0]?.question,
        label: "Вибір із варіантів",
      };
    case ChallengeType.SELECT_IMAGE:
      return {
        question: challenge.SelectImage[0]?.question,
        label: "Вибір із зображенням",
      };
    case ChallengeType.SENTENCE:
      return {
        question: challenge.Sentence[0]?.question,
        label: "Скласти речення",
      };
    default:
      return null;
  }
};

export default function Page({ params }: { params: { lessonId: string } }) {
  const lessonId = parseInt(params.lessonId);

  // #region getLesson & setState
  const { data, isPending } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => getLesson(lessonId),
  });

  const [challenges, setChallenges] = useState(data);

  useEffect(() => {
    setChallenges(data);
  }, [data]);

  // #endregion

  const queryClient = useQueryClient();

  const { mutate, error, isError } = useMutation({
    mutationKey: ["reorder-lesson"],
    mutationFn: async () => {
      const newOrder = debouncedChallenges!.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));
      const result = await reorderChallenges(newOrder!);

      if (!result.success) {
        throw {
          message: result.message,
        };
      }

      return result.data;
    },
    onError: () => {
      setChallenges(data);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["lesson", lessonId],
      });
    },
  });

  // update with delay for changing order
  const debouncedChallenges = useDebounce(challenges, 500);

  const reorderConstraints = useRef(null);

  // #region push update if data changed
  useEffect(() => {
    if (data && debouncedChallenges) {
      if (data !== debouncedChallenges) {
        mutate();
      }
    }
  }, [debouncedChallenges, data, mutate]);
  // #endregion

  if (!data || isPending || !challenges) {
    return <LoadingOverlay />;
  }

  return (
    <main className="my-2 mx-2">
      <div className="z-20">
        <CreateChallenge />
        {isError && <FieldError>{error.message}</FieldError>}
      </div>
      <section className="z-10" ref={reorderConstraints}>
        <Reorder.Group
          axis="y"
          values={challenges}
          onReorder={(data) => {
            setChallenges(data);
          }}
          className="space-y-1"
        >
          {challenges.map(
            (challenge) =>
              getChallengeQuestion(challenge) && (
                <ChallengeDisplay
                  constraints={reorderConstraints}
                  challenge={challenge}
                  key={challenge.id}
                  question={getChallengeQuestion(challenge)!}
                />
              )
          )}
        </Reorder.Group>
      </section>
    </main>
  );
}
