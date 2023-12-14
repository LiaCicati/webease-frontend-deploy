import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const tokenObject = request.cookies.get("token");

  const token =
    tokenObject && typeof tokenObject === "object" ? tokenObject.value : null;

  // Exclude the unauthorized page from redirect checks
  if (pathname === "/unauthorized") {
    return NextResponse.next();
  }

  // Allow the requests for the sign-in page, sign-up page, static files, or the home page
  if (
    pathname.startsWith("/_next") ||
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Decode the JWT and check the user role
  const payload = parseJwt(token);
  if (payload && payload._userRole) {
    const userRole = payload._userRole;

    // Admin has access to all routes
    if (userRole === "ADMIN") {
      return NextResponse.next();
    }

    // Editor has restricted access
    if (userRole === "EDITOR") {
      const allowedPaths = ["/dashboard", "/content-manager"];
      const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));
      if (isAllowed) {
        return NextResponse.next();
      }
    }

    // DEFAULT role has restricted access to only /dashboard
    if (userRole === "DEFAULT") {
      const allowedPaths = ["/dashboard"];
      const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));
      if (isAllowed) {
        return NextResponse.next();
      }
    }

    // Redirect to the unauthorized page if trying to access other routes
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Redirect to sign-in if token is invalid or does not have the required payload
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error("Error decoding token", e);
    return null;
  }
}
