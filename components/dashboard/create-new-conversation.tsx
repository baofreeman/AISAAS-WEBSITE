"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateNewConversation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const formattedPathname = pathname.replace(/^\/|\/$/g, '');


  const [isLoading, setIsLoading] = useState(false);

  const handleCreateConversation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api${pathname}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const paramId = await response.json();
      router.push(`${pathname}/${paramId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={"destructive"}
      onClick={handleCreateConversation}
      disabled={isLoading}
      className="py-4"
    >
      {isLoading ? "Creating..." : `Create new ${formattedPathname}`}
    </Button>
  );
};

export default CreateNewConversation;
