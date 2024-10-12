"use server";

import { verifySession } from "@/lib/session-helper";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
  log: ["error", "info", "warn"],
});

const getCourseByCode = async (code: string) => {
  return await db.language.findUnique({
    where: {
      code,
    },
  });
};

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
      Sentence: true,
      SelectImage: {
        select: {
          id: true,
          question: true,
          correct: true,
          challengeId: true,
          words: {
            select: {
              image: true,
              word: true,
            },
          },
        },
      },
    },
    where: {
      lessonId,
    },
    orderBy: {
      order: "asc",
    },
  });
};

const getLessonFromSameUnit = async (
  lessonId: number,
  languageCode: string,
) => {
  return await db.unit.findFirst({
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
};

const getFirstLessonFromNextUnit = async (unitId: number) => {
  return await db.unit.findFirst({
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
        gt: unitId,
      },
    },
  });
};

const increaseHeart = async () => {
  const session = await verifySession();

  const hearts = await db.user
    .findUniqueOrThrow({
      where: {
        id: session.data.id,
      },
      select: {
        hearts: true,
      },
    })
    .then((user) => user.hearts);

  await db.user.update({
    where: {
      id: session.data.id,
    },
    data: {
      hearts: {
        increment: hearts < 5 ? 1 : 0,
      },
    },
  });
};

const increaseLessonProgress = async (
  lessonId: number,
  languageCode: string,
) => {
  const session = await verifySession();

  const hearts = await db.user.findUniqueOrThrow({
    where: {
      id: session.data.id,
    },
    select: {
      hearts: true,
    },
  });

  if (hearts.hearts <= 1) {
    increaseHeart();
  }

  const lesson = await db.lesson.findFirst({
    where: {
      id: lessonId,
    },
  });

  const unit = await getLessonFromSameUnit(lessonId, languageCode);

  // if there is no lessons in same unit
  if (unit!.Lesson.length === 0) {
    const unit = await getFirstLessonFromNextUnit(lesson!.unitId);

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
  } else {
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
  }
};

export {
  getCourse,
  getCourseByCode,
  getUnits,
  getLessons,
  getLesson,
  increaseLessonProgress,
  increaseHeart,
};
