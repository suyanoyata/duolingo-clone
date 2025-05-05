"use server";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { User } from "@prisma/client";

const generateSession = async (data: User) => {
  const token = await new SignJWT({ id: data.id, isAdmin: data.isAdmin })
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

  const cookie = cookies();
  const expire_date = Date.now() + 7 * 24 * 60 * 60 * 1000;

  cookie.set("access-token", token, {
    expires: expire_date,
  });

  return token;
};

const verifySession = async (): Promise<{
  data: User;
}> => {
  try {
    const cookie = cookies().get("access-token");
    if (!cookie?.value) {
      throw Error();
    }
    const dbUser = await jwtVerify(cookie.value, new TextEncoder().encode(process.env.JWT_SECRET));

    return {
      code: 200,
      data: dbUser.payload as User,
    } as never;
  } catch (error) {
    return {
      error: "You are not authorized",
    } as never;
  }
};

const clearSession = () => {
  return cookies().delete("access-token");
};

export { verifySession, generateSession, clearSession };
