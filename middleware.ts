import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get("auth_token")?.value;
  const authUser = request.cookies.get("auth_user")?.value;
  const isAuthenticated = !!authToken || !!authUser;

  // If not authenticated, redirect to login (except login page itself)
  if (!isAuthenticated && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated and trying to access login, redirect to home
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard", "/admin/:path*"],
};
