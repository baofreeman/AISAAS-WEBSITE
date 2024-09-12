import Google from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
