import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import prisma from "./lib/prismadb";

// Add this type declaration
declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          let existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (existingAccount) {
            await prisma.account.update({
              data: {
                refresh_token: account.refresh_token,
              },
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });
          } else {
            await prisma.account.create({
              data: {
                userId: profile?.id ?? "",
                type: "oauth",
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at
                  ? Math.floor(Date.now() / 1000 + account.expires_at)
                  : null,
              },
            });
          }
        } catch (error) {
          console.error("Error handling account:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      const googleAccount = await prisma.account.findFirst({
        where: { userId: token.sub!, provider: "google" },
      });

      if (!googleAccount) {
        try {
          await prisma.account.create({
            data: {
              userId: token.sub!,
              type: "oauth",
              provider: "google",
              providerAccountId: token.sub!,
              access_token: token.accessToken as string,
              refresh_token: token.refreshToken as string,
              expires_at: token.expiresIn
                ? Math.floor(Date.now() / 1000 + Number(token.expiresIn))
                : null,
            },
          });
        } catch (error) {
          console.error("Error creating new account entry", error);
          session.error = "RefreshTokenError";
          return session;
        }
      }

      if (
        googleAccount &&
        googleAccount.expires_at &&
        googleAccount.expires_at * 1000 < Date.now()
      ) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: googleAccount.refresh_token || "",
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          await prisma.account.update({
            data: {
              access_token: newTokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
              refresh_token:
                newTokens.refresh_token ?? googleAccount.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: googleAccount.providerAccountId,
              },
            },
          });
        } catch (error) {
          console.error("Error refreshing access_token", error);
          session.error = "RefreshTokenError";
        }
      }

      return session;
    },
  },
  ...authConfig,
});
