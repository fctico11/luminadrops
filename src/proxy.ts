import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/jwt";
import { ADMIN_FLAG_COOKIE } from "@/lib/admin-flag";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  // Sessions that predate the flag get it the next time they open any admin page.
  if (!request.cookies.get(ADMIN_FLAG_COOKIE)) {
    response.cookies.set(ADMIN_FLAG_COOKIE, "1", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
