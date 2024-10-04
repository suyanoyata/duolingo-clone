import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const db = new PrismaClient().$extends(withAccelerate());

export const getCourseByCode = async (code: string) => {
  const language = await db.language.findUniqueOrThrow({
    select: {
      code: true,
      name: true,
    },
    where: {
      code,
    },
  });

  const units = await db.unit.findMany({
    where: {
      languageCode: language.code,
    },
    select: {
      Lesson: {
        select: {
          id: true,
        },
      },
    },
  });

  let lessons = 0;

  units.forEach((unit) => {
    lessons += unit.Lesson.length;
  });

  return {
    ...language,
    units: units.length,
    lessons,
  };
};
