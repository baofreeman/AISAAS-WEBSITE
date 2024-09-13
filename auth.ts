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
          const userId = profile?.sub ?? "";

          // Check if the user exists
          let user = await prisma.user.findUnique({
            where: { id: userId },
          });

          // Create a new user if not exists
          if (!user) {
            user = await prisma.user.create({
              data: {
                id: userId,
                // Include any other required user fields
              },
            });
          }

          // Check if the account exists
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (existingAccount) {
            // Update existing account
            await prisma.account.update({
              data: {
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at
                  ? Math.floor(Date.now() / 1000 + account.expires_at)
                  : null,
              },
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });
          } else {
            // Create a new account
            await prisma.account.create({
              data: {
                userId: user.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at
                  ? Math.floor(Date.now() / 1000 + account.expires_at)
                  : null,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
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
        console.error("No Google account found for user");
        session.error = "RefreshTokenError";
        return session;
      }

      if (
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
