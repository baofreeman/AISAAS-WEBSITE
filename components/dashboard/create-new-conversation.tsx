"use client";

import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Loader from "../loader";

const CreateNewConversation = () => {
  const router = useRouter();
  const pathname = usePathname();
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
      variant={"outline"}
      onClick={handleCreateConversation}
      disabled={isLoading}
      className="py-4 border-none"
    >
      {isLoading ? <Loader /> : <SquarePen size={24} />}
    </Button>
  );
};

export default CreateNewConversation;
