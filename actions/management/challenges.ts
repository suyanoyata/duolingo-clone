"use server";

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const createChallenge = async (body: {
  language: string;
  sentence: string;
  translate: string;
  lesson: number;
  bait: string;
}) => {
  console.log(body);

  const languageCode = await db.language.findUnique({
    where: {
      code: body.language,
    },
  });

  if (!languageCode) {
    throw new Error(`Language with ${body.language} code does not exist.`);
  }

  const lesson = await db.lesson.findUnique({
    where: {
      id: body.lesson,
    },
  });

  if (!lesson) {
    throw new Error(`Can't create challenge for non existing lesson.`);
  }

  const challenge = await db.challenge.create({
    data: {
      type: "sentence",
      name: "sample name",
      order: 1,
      lessonId: lesson.id,
    },
  });

  return challenge;
};

const getChallenges = async (lessonId: number) => {
  return await db.challenge.findMany({
    where: {
      lesson: {
        id: lessonId,
      },
    },
  });
};

export { createChallenge, getChallenges };
