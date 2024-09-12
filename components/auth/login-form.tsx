"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="flex flex-col p-8 justify-center items-center h-screen">
      <div className="bg-card flex flex-col items-center justify-center p-8 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6 pb-2 border-b-2 border-gray-300">
          Login
        </h1>

        <Button
          variant={"destructive"}
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          Sign in with Google
        </Button>
        <p className="text-sm text-center text-muted-foreground mt-4">
          Sign in to access your account
          <br />
          and start using our AI-powered services.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
