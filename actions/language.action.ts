"use server";

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const getLanguages = async () => {
  return await db.language.findMany();
};

export { getLanguages };
