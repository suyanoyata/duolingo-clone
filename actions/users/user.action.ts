"use server";

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import {
  clearSession,
  generateSession,
  verifySession,
} from "@/lib/session-helper";
import { hashPassword } from "@/lib/hash-password";
import {
  User,
  UserLoginFormData,
  UserLoginSchema,
  UserRegisterFormData,
  UserRegisterSchema,
} from "@/types/User";
import bcrypt from "bcrypt";

const db = new PrismaClient();

const generateName = () => {
  return `${faker.word.adverb()}-${faker.word.adjective()}-${faker.word.noun()}-${faker.number.int({ min: 1000, max: 9999 })}`;
};

const createUser = async (user: UserRegisterFormData) => {
  const createUser = UserRegisterSchema.parse(user);

  const exists = await db.user.findFirst({
    where: {
      email: createUser.email,
    },
  });

  if (exists) {
    throw new Error("User already exists");
  }

  let attempts = 0;

  while (attempts < 10) {
    const nickname = generateName();

    const exists = await db.user.findFirst({
      where: {
        nickname,
      },
    });

    if (!exists) {
      createUser.nickname = nickname;
      break;
    }

    attempts++;
  }

  if (attempts == 10) {
    throw new Error("Something went wrong");
  }

  const create = await db.user.create({
    data: {
      name: createUser.name,
      email: createUser.email,
      nickname: createUser.nickname,
      password: await hashPassword(createUser.password),
      hearts: 5,
      experience: 0,
      score: 0,
    },
  });

  await generateSession(create);

  return create;
};

const loginUser = async (user: UserLoginFormData) => {
  const userData = UserLoginSchema.parse(user);

  const exists = await db.user.findFirst({
    where: {
      email: userData.email,
    },
  });

  if (!exists) {
    throw {
      error: "User not found",
    };
  }

  const password = await bcrypt.compare(userData.password, exists.password);

  if (!password) {
    throw {
      error: "Password is incorrect",
    };
  }

  await generateSession(exists);

  return exists;
};

const getCurrentUser = async () => {
  const session = await verifySession();

  try {
    const user = await db.user.findUniqueOrThrow({
      where: {
        id: session.data.id,
      },
    });

    let score = 0;

    const progress = await db.progress.findMany({
      where: {
        userId: user.id,
      },
    });

    progress.forEach((progress) => {
      score += progress.score;
    });

    return User.parse({
      ...user,
      score,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      clearSession();
      throw new Error("Session error");
    }

    console.error(error);
  }
};

const subscribeToCourse = async (code: string, courseId: number) => {
  const session = await verifySession();

  const exists = await db.progress.findFirst({
    where: {
      userId: session.data.id,
      languageCode: code,
    },
  });

  if (exists) {
    throw new Error("User already subscribed to this course");
  }

  const course = await db.unit.findFirst({
    where: {
      languageCode: code,
    },
    select: {
      id: true,
      Lesson: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!course || course.Lesson.length == 0) {
    throw new Error("Something went wrong");
  }

  const progress = await db.progress.create({
    data: {
      courseId,
      userId: session.data.id,
      languageCode: code,
      score: 0,
      unitId: course.id,
      lastCompletedLesson: course.Lesson[0].id,
    },
  });

  return progress;
};

const setActiveCourse = async (code: string) => {
  const session = await verifySession();

  const progress = await db.progress.findFirst({
    where: {
      languageCode: code,
      userId: session.data.id,
    },
  });

  if (!progress) {
    throw new Error("No progress found");
  }

  const user = await db.user.update({
    where: {
      id: session.data.id,
    },
    data: {
      progressId: progress.id,
    },
  });

  return user;
};

const getCurrentUserCourses = async (userId?: number) => {
  const session = await verifySession();

  const courses = await db.progress.findMany({
    where: {
      userId: userId ?? session.data.id,
    },
    orderBy: {
      score: "desc",
    },
    include: {
      language: true,
    },
  });

  return courses;
};

const getUser = async (nickname: string) => {
  const user = await db.user.findFirst({
    where: {
      nickname,
    },
    select: {
      id: true,
      name: true,
      nickname: true,
      score: true,
      joinedAt: true,
      progressId: true,
    },
  });

  if (!user) {
    return {
      id: 0,
      name: "",
      score: 0,
      joinedAt: new Date(),
      progressId: 0,
    };
  }

  const progress = await db.progress.findMany({
    where: {
      userId: user.id,
    },
  });

  let score = 0;

  progress.forEach((progress) => {
    score += progress.score;
  });

  return {
    ...user,
    score,
  };
};

const getCurrentHearts = async (id: number) => {
  return await db.user.findFirst({
    where: {
      id,
    },
    select: {
      hearts: true,
    },
  });
};

const reduceHearts = async () => {
  const session = await verifySession();

  const currentHearts = await getCurrentHearts(session.data.id);

  if (currentHearts?.hearts === 0) {
    return await db.user.findFirst({
      where: {
        id: session.data.id,
      },
    });
  }

  return await db.user.update({
    where: {
      id: session.data.id,
    },
    data: {
      hearts: {
        decrement: 1,
      },
    },
  });
};

export {
  createUser,
  generateName,
  getCurrentUser,
  getUser,
  loginUser,
  subscribeToCourse,
  getCurrentUserCourses,
  setActiveCourse,
  reduceHearts,
};
