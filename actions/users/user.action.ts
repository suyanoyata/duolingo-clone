"use server";

import { PrismaClient } from "@prisma/client";
import { generateSession, verifySession } from "@/lib/session-helper";
import { hashPassword } from "@/lib/hash-password";
import {
  User,
  UserLoginFormData,
  UserLoginSchema,
  UserRegisterFormData,
  UserRegisterSchema,
} from "@/types/User";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createUser = async (user: UserRegisterFormData) => {
  const createUser = UserRegisterSchema.parse(user);

  const exists = await prisma.user.findFirst({
    where: {
      email: createUser.email,
    },
  });

  if (exists) {
    throw new Error("User already exists");
  }

  const create = await prisma.user.create({
    data: {
      name: createUser.name,
      email: createUser.email,
      password: await hashPassword(createUser.password),
      hearts: 5,
      experience: 0,
      score: 0,
    },
  });

  generateSession(create);

  return create;
};

const loginUser = async (user: UserLoginFormData) => {
  const userData = UserLoginSchema.parse(user);

  const exists = await prisma.user.findFirst({
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

  generateSession(exists);

  return exists;
};

const getCurrentUser = async () => {
  const session = await verifySession();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.data.id,
    },
  });

  return User.parse(user);
};

const getUser = async (name: string) => {
  const user = await prisma.user.findFirst({
    where: {
      name,
    },
    select: {
      id: true,
      name: true,
      score: true,
      joinedAt: true,
    },
  });

  if (!user) {
    return {
      id: 0,
      name: "",
      score: 0,
      joinedAt: new Date(),
    };
  }

  return user;
};

export { createUser, getCurrentUser, getUser, loginUser };
