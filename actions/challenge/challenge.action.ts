"use server";

import { verifySession } from "@/lib/session-helper";
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
    sentence: challenges[id].sentenceChallenge!.sentence,
    translate: challenges[id].sentenceChallenge!.translate,
    correct: challenges[id].sentenceChallenge!.correct,
  };
};

const HEART_LIMIT = 5;

const reduceHeart = async () => {
  const session = await verifySession();

  if (!session) {
    throw {
      error: "No session found",
    };
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.data.id,
    },
  });

  if (user.hearts <= 0) {
    throw {
      error: "No hearts left",
    };
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: session.data.id,
    },
    data: {
      hearts: user.hearts - 1,
    },
  });

  return updatedUser;
};

const addHeart = async () => {
  const session = await verifySession();

  if (!session) {
    throw {
      error: "No session found",
    };
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.data.id,
    },
  });

  if (user.hearts >= HEART_LIMIT) {
    return null;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: session.data.id,
    },
    data: {
      hearts: user.hearts + 1,
    },
  });

  return updatedUser;
};

export { getRandomSentence, reduceHeart, addHeart };
