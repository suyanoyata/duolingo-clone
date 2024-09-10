"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRandomSentence = async (code: string) => {
  const language = await prisma.language.findUnique({
    where: {
      code,
    },
  });

  if (!language) {
    throw {
      error: `No language with ${code} code exists.`,
    };
  }

  const challenges = await prisma.challenge.findMany({
    select: {
      sentenceChallenge: {
        select: {
          sentence: true,
          translate: true,
          correct: true,
        },
      },
    },
    where: {
      type: "sentence",
      lessonId: 2,
    },
  });

  const length = challenges.length;

  let id = 0;

  id = Math.floor(Math.random() * length);

  return {
    sentence: challenges[id].sentenceChallenge?.sentence,
    translate: challenges[id].sentenceChallenge?.translate,
    correct: challenges[id].sentenceChallenge?.correct,
  };
};

export { getRandomSentence };
