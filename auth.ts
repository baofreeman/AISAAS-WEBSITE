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
  trustHost: true,
  callbacks: {
    async signIn({ account, profile }) {
      console.log("Account:", account);
      console.log("Profile:", profile);
      if (account?.provider === "google") {
        try {
          const userId = profile?.sub ?? "";
          const userEmail = profile?.email ?? null;

          if (!userEmail) return false;
          let user = await prisma.user.findUnique({
            where: { email: userEmail },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                id: userId,
                name: profile?.name ?? null,
                email: profile?.email ?? null,
                image: profile?.picture ?? null,
              },
            });
          }

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
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              data: {
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at
                  ? Math.floor(account.expires_at)
                  : null,
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
                  ? Math.floor(account.expires_at)
                  : null,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
        } catch (error: any) {
          if (error.code === "P2002") {
            console.error(
              `Unique constraint failed on field: ${error.meta?.target}`
            );
          } else {
            console.error("Error handling account:", error);
          }
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
              expires_at: Math.floor(Date.now() / 1000) + newTokens.expires_in,
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
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "lax",
  //       path: "/",
  //     },
  //   },
  // },
  ...authConfig,
});
