import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "./lib/session-helper";

export async function middleware(request: NextRequest) {
  const session = await verifySession();

  if (!session.data?.id) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  if (session && !session.data.isAdmin) {
    return NextResponse.redirect(new URL("/learn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
