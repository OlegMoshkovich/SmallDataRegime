import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "sdr-auth";
const COOKIE_VALUE = "ok";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the sign-in page and its API
  if (
    pathname === "/signin" ||
    pathname.startsWith("/api/signin") ||
    pathname.startsWith("/api/agent/github")
  ) {
    return NextResponse.next();
  }

  const auth = request.cookies.get(COOKIE_NAME);
  if (auth?.value !== COOKIE_VALUE) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
