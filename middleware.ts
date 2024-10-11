import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
} from "./constants";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoutes = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isStripe = nextUrl.pathname.startsWith("/api/webhook");
  const isPublicRoutes = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  console.log("Middleware triggered for:", nextUrl.pathname);
  console.log("Is logged in:", isLoggedIn);
  console.log("Is API auth route:", isApiAuthRoutes);
  console.log("Is public route:", isPublicRoutes);
  console.log("Is auth route:", isAuthRoute);
  console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

  if (isStripe) {
    console.log("Allowing request to Stripe webhook");
    return;
  }

  if (isApiAuthRoutes) {
    console.log("Allowing API auth route");
    return;
  }

  if (isAuthRoute) {
    console.log("Auth route detected");

    if (isLoggedIn) {
      console.log("User is logged in, redirecting to:", DEFAULT_LOGIN_REDIRECT);
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    console.log("User is not logged in, allowing access to auth route");
    return;
  }

  if (!isLoggedIn && !isPublicRoutes) {
    console.log("User is not logged in and not on a public route");
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    console.log("Redirecting to login with callback URL:", encodedCallbackUrl);
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  console.log("Allowing access to route:", nextUrl.pathname);
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
