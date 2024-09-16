"use server";

import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { User } from "@prisma/client";

const generateSession = (data: User) => {
  const token = sign({ id: data.id }, process.env.JWT_SECRET as string);

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
    const dbUser = verify(cookie.value, process.env.JWT_SECRET as string);

    return {
      code: 200,
      data: dbUser as unknown,
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
