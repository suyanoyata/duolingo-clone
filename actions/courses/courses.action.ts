"use server";

import { verifySession } from "@/lib/session-helper";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getCourse = async (id: number | undefined | null) => {
  if (!id) {
    throw new Error("No course id provided");
  }
  const progress = await db.progress.findUnique({
    where: {
      id,
    },
  });

  if (!progress) {
    throw new Error("Progress not found");
  }

  return await db.language.findUnique({
    where: {
      id: progress.courseId,
    },
  });
};

const getUnits = async (code: string) => {
  return await db.unit.findMany({
    where: {
      languageCode: code,
    },
    orderBy: {
      order: "asc",
    },
  });
};

const getLessons = async (unitId: number) => {
  return await db.lesson.findMany({
    where: {
      unitId,
    },
    orderBy: {
      order: "asc",
    },
  });
};

const getLesson = async (lessonId: number) => {
  return await db.challenge.findMany({
    select: {
      id: true,
      order: true,
      lessonId: true,
      type: true,
      Select: true,
    },
    where: {
      lessonId,
    },
    orderBy: {
      order: "asc",
    },
  });
};

const increaseLessonProgress = async (
  lessonId: number,
  languageCode: string,
) => {
  const session = await verifySession();

  const lesson = await db.lesson.findFirst({
    where: {
      id: lessonId,
    },
  });

  // take next lesson from same unit
  const unit = await db.unit.findFirst({
    select: {
      Lesson: {
        where: {
          id: {
            gt: lessonId,
          },
        },
      },
    },
    where: {
      languageCode,
    },
  });

  // if there is no lessons in same unit
  if (unit!.Lesson.length === 0) {
    // take first lesson from next unit
    const unit = await db.unit.findFirst({
      select: {
        id: true,
        Lesson: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: {
          gt: lesson!.unitId,
        },
      },
    });

    // set new unit and lesson
    await db.progress.update({
      where: {
        userId_languageCode: {
          userId: session.data.id,
          languageCode,
        },
      },
      data: {
        score: {
          increment: 15,
        },
        unitId: unit!.id,
        lastCompletedLesson: unit?.Lesson[0].id,
      },
    });
  }

  // set next lesson from same unit
  await db.progress.update({
    where: {
      userId_languageCode: {
        userId: session.data.id,
        languageCode,
      },
    },
    data: {
      score: {
        increment: 15,
      },
      lastCompletedLesson: unit?.Lesson[0].id,
    },
  });
};

export { getCourse, getUnits, getLessons, getLesson, increaseLessonProgress };
