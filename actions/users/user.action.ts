"use server";

import { PrismaClient } from "@prisma/client";
import { CreateUser } from "@/types/User";
import { generateSession } from "@/lib/session-helper";

const prisma = new PrismaClient();

const createUser = async (user: CreateUser) => {
  return await prisma.user.create({
    data: user,
  });
};

const getUsers = async () => {
  const users = await prisma.user.findMany({});

  generateSession(users![0]);

  console.log(`user.action.ts: wrote session from ${users[0].email}`);

  return users;
};

export { createUser, getUsers };
