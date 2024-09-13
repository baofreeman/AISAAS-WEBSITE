"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "OAuthAccountNotLinked") {
      // Handle the specific error for OAuth account not linked
      console.error("OAuth account is not linked to an existing account");
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
      <p className="text-xl mb-4">
        {error === "OAuthAccountNotLinked"
          ? "This OAuth account is not linked to an existing account."
          : "An error occurred during authentication."}
      </p>
      <button
        onClick={() => router.push("/login")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Return to Login
      </button>
    </div>
  );
}
