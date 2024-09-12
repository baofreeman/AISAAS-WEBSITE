import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
} from "./contants";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoutes = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoutes = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoutes) {
    console.log("is api");
    return;
  }

  if (isAuthRoute) {
    console.log("is auth");

    if (isLoggedIn) {
      console.log("is login");

      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoutes) {
    console.log("login");
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
