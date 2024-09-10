"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRandomSentence = async () => {
  const challenges = await prisma.challenge.findMany({
    select: {
      challenge: {
        select: {
          sentence: true,
          translate: true,
          correct: true,
        },
      },
    },
  });
  const length = challenges.length;

  let id = 0;

  id = Math.floor(Math.random() * length);

  return {
    sentence: challenges[id].challenge[0].sentence,
    correct: challenges[id].challenge[0].correct,
    translate: challenges[id].challenge[0].translate,
  };
};

export { getRandomSentence };
