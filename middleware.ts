import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function checkCookie(request: NextRequest) {
  return request.cookies.get("nuvi-auth");
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname === "/") {
    const hasCookie = checkCookie(request);

    if (!hasCookie) {
      return NextResponse.redirect(url.origin + "/login");
    } else {
      if (url.pathname === "/") {
        return NextResponse.redirect(url.origin + "/app");
      }
    }
  } else if (url.pathname === "/login") {
    const hasCookie = checkCookie(request);

    if (hasCookie) {
      return NextResponse.redirect(url.origin + "/app");
    }
  } else if (url.pathname === "/app") {
    const cookie = checkCookie(request);

    if (!cookie) {
      return NextResponse.redirect(url.origin + "/login");
    }

    const isValid = await fetch(url.origin + "/api/cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cookie: cookie.value }),
    });

    if (isValid.status !== 200) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("nuvi-auth");
      return response;
    }
  }
  return NextResponse.next();
}
