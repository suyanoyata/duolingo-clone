import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const db = new PrismaClient().$extends(withAccelerate());

export const getCourseByCode = async (code: string) => {
  return await db.language.findUnique({
    where: {
      code,
    },
  });
};
