"use server";

import { PrismaClient } from "@prisma/client";
import { CreateUser, UserWithoutId } from "@/types/User";
import { generateSession, verifySession } from "@/lib/session-helper";
import { hashPassword } from "@/lib/hash-password";

const prisma = new PrismaClient();

const createUser = async (user: CreateUser) => {
  const createUser = UserWithoutId.parse(user);
  console.log("[+] parsed user");

  const create = await prisma.user.create({
    data: {
      name: createUser.name,
      email: createUser.email,
      password: await hashPassword(createUser.password),
      hearts: 5,
    },
  });

  console.log("Created new user", create);

  return create;
};

const getUsers = async () => {
  const users = await prisma.user.findMany({});

  generateSession(users![0]);

  console.log(`user.action.ts: wrote session from ${users[0].email}`);

  return users;
};

const getSession = async () => {
  const session = await verifySession();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.data.id,
    },
  });

  return user;
};

export { createUser, getUsers, getSession };
