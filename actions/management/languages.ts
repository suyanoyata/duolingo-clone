"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const db = new PrismaClient();

const getAllLanguages = async () => {
  return await db.language.findMany({
    select: {
      id: true,
      code: true,
      name: true,
    },
  });
};

const addNewLanguage = async (language: { code?: string; name?: string }) => {
  if (!language.code || !language.name) {
    throw new Error("Language code and name are required");
  }

  if (language.code.length !== 2) {
    throw {
      error: "Language code must be 2 characters long",
    };
  }

  if (language.name.length > 16) {
    throw {
      error: "Language name is too long",
    };
  }

  const exists = await db.language.findFirst({
    where: {
      code: language.code,
    },
  });

  if (exists) {
    throw new Error("Language with this code already exists");
  }

  return await db.language.create({
    data: {
      code: language.code!,
      name: language.name!,
    },
  });
};

const getLanguageWords = async (languageCode: string) => {
  if (!languageCode) {
    throw new Error("Language code is required");
  }
  return await db.word.findMany({
    where: {
      language: {
        code: languageCode,
      },
    },
  });
};

const addNewWord = async (word: {
  text?: string;
  meaning?: string;
  language?: string;
}) => {
  const newWord = z
    .object({
      text: z.string().max(32),
      meaning: z.string().max(32),
      language: z.string().length(2),
    })
    .parse(word);

  const exists = await db.word.findFirst({
    where: {
      language: {
        code: newWord.language,
      },
      text: newWord.text,
    },
  });

  if (exists) {
    throw {
      error: "Language with this code already exists",
    };
  }

  throw new Error("Not implemented");

  // return await db.word.create({});
};

export { getAllLanguages, addNewLanguage, getLanguageWords, addNewWord };
