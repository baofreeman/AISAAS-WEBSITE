"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
          variant={"default"}
          onClick={handleGoogleSignIn}
          className="w-full h-full"
        >
          <Image
            src={"/icons/google.png"}
            alt="google"
            width={20}
            height={20}
          />
          <h1 className="ml-4">Sign in with Google</h1>
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Sign in to access your account
          <br />
          and start using our AI-powered services.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
