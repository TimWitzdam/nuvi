import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname === "/") {
    const hasCookie = request.cookies.get("nuvi-auth");

    if (!hasCookie) {
      return NextResponse.redirect(url.origin + "/login");
    } else {
      if (url.pathname === "/") {
        return NextResponse.redirect(url.origin + "/app");
      }
    }
  }
  return NextResponse.next();
}
