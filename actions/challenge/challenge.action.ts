"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRandomSentence = async () => {
  const challenges = await prisma.challenge.findMany({
    select: {
      challenge: {
        select: {
          sentence: true,
        },
      },
    },
  });
  console.log(`got ${challenges.length} sentence challenges`);
  const length = challenges.length;

  let id = 0;

  id = Math.floor(Math.random() * length);

  return challenges[id].challenge[0].sentence;
};

export { getRandomSentence };
