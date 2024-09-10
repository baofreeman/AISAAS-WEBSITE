import { auth } from "@/auth";
import React from "react";
import { SessionProvider } from "next-auth/react";

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext: React.FC<AuthContextProps> = async ({ children }) => {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthContext;
