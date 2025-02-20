"use server";

import { verifySession } from "@/lib/session-helper";
import UploadService from "@/lib/supabase-client";
import { shuffle } from "@/lib/utils";
import {
  ChallengeData,
  CourseCreateFormData,
  CreateBuildSentenceChallengeSchema,
  CreateBuildSentenceFormData,
} from "@/types/Forms";
import { Challenge, ChallengeType, Lesson, PrismaClient, Sentence, Unit } from "@prisma/client";

const db = new PrismaClient();

const isPermittedAction = async () => {
  const session = await verifySession();

  const exists = await db.user.findFirst({
    where: {
      id: session.data.id,
      isAdmin: true,
    },
  });

  if (!exists) {
    return {
      success: false,
      message: "Недостатньо прав для виконання цієї дії",
    };
  }

  return {
    success: true,
  };
};

const createCourse = async (course: CourseCreateFormData) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const exists = await db.language.findFirst({
    where: {
      OR: [
        {
          name: course.course_name,
        },
        {
          code: course.course_code,
        },
      ],
    },
  });

  if (exists) {
    return {
      success: false,
      message: "Такий курс вже існує",
    };
  }

  const language = await db.language.create({
    data: {
      name: course.course_name,
      code: course.course_code,
    },
  });

  return {
    success: true,
    data: language,
  };
};

const createSelectChallenge = async (challenge: Omit<ChallengeData, "correct">, lesson: number) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const newChallenge = await db.challenge.create({
    data: {
      lessonId: lesson,
      type: ChallengeType.SELECT,
      Select: {
        create: {
          question: challenge.question,
          options: challenge.options,
          answer: challenge.answer,
        },
      },
    },
  });

  return {
    success: true,
    data: newChallenge,
  };
};

const createBuildSentenceChallenge = async (
  challenge: CreateBuildSentenceFormData,
  lessonId: number
) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const data = CreateBuildSentenceChallengeSchema.parse(challenge);

  const payload: Omit<Sentence, "id" | "challengeId"> = {
    correct: data.correct.split(" "),
    question: data.question,
    words: shuffle([...data.correct.split(" "), ...data.words.split(" ")]),
  };

  await db.challenge.create({
    data: {
      type: ChallengeType.SENTENCE,
      lessonId,
      Sentence: {
        create: payload,
      },
    },
  });

  return data;
};

const createSelectImageChallenge = async (
  data: Omit<ChallengeData, "correct">,
  formData: FormData,
  lesson: number
) => {
  /* this function should implement following:
     1. create storage bucket for challenge
     2. upload images
     3. create database instance
  */

  const images = formData.getAll("images");

  console.log("start");

  const challenge = await db.challenge.create({
    data: {
      type: ChallengeType.SELECT_IMAGE,
      lessonId: lesson,
    },
  });

  await UploadService.createBucket(challenge.id);

  const wordImages = await Promise.all(
    images.map(async (value) => {
      if (value) {
        return await UploadService.upload(challenge.id, value as unknown as File);
      }
    })
  );

  await db.challenge.update({
    where: {
      id: challenge.id,
    },
    data: {
      SelectImage: {
        create: {
          question: data.question,
          correct: data.answer,
          words: {
            createMany: {
              data: wordImages.map((image, index) => ({
                word: data.imageOptions ? data.imageOptions[index].word : "",
                image: image ? image.data.publicUrl : "",
              })),
            },
          },
        },
      },
    },
  });

  return {
    success: false,
    data: [],
  };
};

const editUnit = async (unit: Unit) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const updatedUnit = await db.unit.update({
    where: {
      id: unit.id,
    },
    data: {
      name: unit.name,
      description: unit.description,
    },
  });

  return {
    success: true,
    data: updatedUnit,
  };
};

const editLesson = async (lesson: Lesson) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  const updatedLesson = await db.lesson.update({
    where: {
      id: lesson.id,
    },
    data: {
      isLessonVisible: lesson.isLessonVisible,
    },
  });

  return {
    success: true,
    data: updatedLesson,
  };
};

const reorderChallenges = async (challenges: Challenge[]) => {
  const permitted = await isPermittedAction();

  if (!permitted.success) {
    return {
      success: false,
      message: permitted.message,
    };
  }

  try {
    const result = await db.$transaction(async (tx) => {
      for (const item of challenges) {
        await tx.challenge.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
    });
    return {
      success: true,
      data: result,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Сталась помилка при зміні порядку завдань, спробуйте пізніше",
    };
  }
};

export {
  createCourse,
  createSelectChallenge,
  createBuildSentenceChallenge,
  createSelectImageChallenge,
  editUnit,
  editLesson,
  reorderChallenges,
};
