import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createChallengeStore } from "@/store/create-lesson-store";
import { ChallengeType } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const CreateChallengeSelectComponent = ({
  disabled,
  type,
  children,
  src,
  set,
}: {
  disabled?: boolean;
  type: ChallengeType;
  children: string;
  src: string;
  set: (index: number) => void;
}) => {
  const { setChallengeType } = createChallengeStore();

  return (
    <Button
      disabled={disabled}
      onClick={() => {
        setChallengeType(type);
        set(1);
      }}
      className={cn("h-48 w-48 flex-col gap-2 p-8")}
      size="icon"
    >
      <Image
        className="mix-blend-multiply"
        src={`${src}`}
        width={120}
        height={120}
        alt=""
      />
      <p className="mt-auto">{children}</p>
    </Button>
  );
};

export const CreateChallengeSelectType = ({
  current,
  index,
  setCurrent,
}: {
  current: number;
  setCurrent: (index: number) => void;
  index: number;
}) => {
  if (current != index) return null;

  return (
    <motion.div
      key="create-challenge-select-type-div"
      exit={{ opacity: 0, x: -100 }}
      initial={{ opacity: 1, x: 0 }}
      className="flex flex-row gap-2 flex-wrap justify-center max-sm:content-start"
    >
      <CreateChallengeSelectComponent
        set={setCurrent}
        type={ChallengeType.SELECT}
        src="/select-challenge.png"
      >
        Вибір із варіантів
      </CreateChallengeSelectComponent>
      <CreateChallengeSelectComponent
        set={setCurrent}
        type={ChallengeType.SELECT_IMAGE}
        src="/select-with-image.png"
      >
        Вибір із зображенням
      </CreateChallengeSelectComponent>
      <CreateChallengeSelectComponent
        set={setCurrent}
        type={ChallengeType.SENTENCE}
        src="/create-sentence.png"
      >
        Складання речення
      </CreateChallengeSelectComponent>
    </motion.div>
  );
};
