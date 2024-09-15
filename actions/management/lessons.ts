"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const db = new PrismaClient();

const getLanguageLessons = async (languageCode: string) => {
  console.log(languageCode);
  if (!languageCode) {
    throw new Error("Language code is required");
  }
  return await db.lesson.findMany({
    where: {
      language: {
        code: languageCode,
      },
    },
  });
};

const addNewLesson = async (lesson: { name: string; language: string }) => {
  const newLesson = z
    .object({
      name: z.string().max(32),
      language: z.string().length(2),
    })
    .parse(lesson);

  const lessons = await db.lesson.findMany({
    where: {
      language: {
        code: newLesson.language,
      },
    },
  });

  return await db.lesson.create({
    data: {
      name: newLesson.name,
      order: lessons.length + 1,
      language: {
        connect: {
          code: newLesson.language,
        },
      },
    },
  });
};

const removeLesson = async (lesson: { id: number }) => {
  const remove = z
    .object({
      id: z.number(),
    })
    .parse(lesson);

  return await db.lesson.delete({
    where: {
      id: remove.id,
    },
  });
};

export { getLanguageLessons, addNewLesson, removeLesson };
