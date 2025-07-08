import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/auth-client";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];
const ADMIN_ONLY = ["/admin"];

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const isPublic = PUBLIC_ROUTES.includes(req.nextUrl.pathname);
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("auth/login", req.url));
  }

  //if not admin redirect to dashboard
  if (token) {
    const user = decodeToken(token);
    const isAdminOnly = ADMIN_ONLY.includes(req.nextUrl.pathname);
    if (user?.role !== "ADMIN" && isAdminOnly) {
      return NextResponse.redirect(new URL("dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*"], // secure these
};
