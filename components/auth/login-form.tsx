"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Button variant={"destructive"} onClick={handleGoogleSignIn}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default LoginForm;
