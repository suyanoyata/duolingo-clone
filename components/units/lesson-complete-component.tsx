import { clientStore } from "@/store/user-store";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ButtonTitle } from "../title-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import ReactConfetti from "react-confetti";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

export const LessonComplete = ({
  challengeLength,
}: {
  challengeLength: number;
}) => {
  const { currentChallengeIndex, lastLanguageCode } = clientStore();

  const { data: user, refetch } = useQuery<User>({
    queryKey: ["user"],
  });

  const dimensions = useWindowDimensions();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentChallengeIndex == challengeLength) {
      queryClient.removeQueries({
        queryKey: ["profile", user?.name],
      });
      refetch();
    }
  }, [currentChallengeIndex]);

  const router = useRouter();

  if (currentChallengeIndex != challengeLength) return null;

  return (
    <>
      <motion.div
        className="z-10 bg-white top-0 left-0 absolute h-screen w-full"
        transition={{
          ease: "linear",
          duration: 0.8,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <main className="flex flex-col items-center justify-center h-screen w-full absolute top-0 left-0 space-y-2 px-3 z-30">
        <ReactConfetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          className="z-20"
        />
        <h1 className="text-2xl font-extrabold text-zinc-800">
          Ви пройшли урок
        </h1>
        <div className="flex flex-wrap gap-2 justify-center">
          <ButtonTitle title="Отримано балів">+15</ButtonTitle>
          <ButtonTitle variant="hearts" title="Залишилось сердець">
            {user!.hearts}
          </ButtonTitle>
        </div>
        <Button
          onClick={() => {
            router.push(`/learn/${lastLanguageCode}`);
          }}
          className="max-sm:w-full"
          variant="primary"
        >
          Продовжити
        </Button>
      </main>
    </>
  );
};
