"use server";

import { verifySession } from "@/lib/session-helper";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getRandomSentence = async (code: string) => {
  const language = await db.language.findUnique({
    where: {
      code,
    },
  });

  if (!language) {
    throw {
      error: `No language with ${code} code exists.`,
    };
  }

  const challenges = await db.challenge.findMany({
    select: {},
    where: {
      lesson: {
        language: {
          code: language.code,
        },
      },
    },
  });

  const length = challenges.length;

  let id = 0;

  id = Math.floor(Math.random() * length);

  return challenges[id];
};

const HEART_LIMIT = 5;

const reduceHeart = async () => {
  const session = await verifySession();

  if (!session) {
    throw {
      error: "No session found",
    };
  }

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: session.data.id,
    },
  });

  if (user.hearts <= 0) {
    throw {
      error: "No hearts left",
    };
  }

  const updatedUser = await db.user.update({
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

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: session.data.id,
    },
  });

  if (user.hearts >= HEART_LIMIT) {
    return null;
  }

  const updatedUser = await db.user.update({
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
