import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client/edge";
import { verifySession } from "./lib/session-helper";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function middleware(request: NextRequest) {
  const session = await verifySession();
  const db = new PrismaClient().$extends(withAccelerate());

  if (!session.data?.id) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  const user = await db.user.findFirst({
    where: {
      id: session.data.id,
    },
  });

  if (!user || (user && !user.isAdmin)) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
