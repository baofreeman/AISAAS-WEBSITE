"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-gray-600">We apologize for the inconvenience.</p>
      <Button onClick={() => window.location.reload()} variant="outline">
        Try again
      </Button>
    </div>
  );
};

export default ErrorPage;
