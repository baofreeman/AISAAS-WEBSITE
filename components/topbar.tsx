"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "600", subsets: ["latin"] });

const Topbar = () => {
  const { handleOpenOrClose } = useSidebarStore();
  return (
    <div
      className={cn(
        "group flex items-center p-4 justify-between sticky top-0",
        "lg:hidden"
      )}
    >
      <div className="flex items-center">
        <Logo />
        <span className={cn("ml-2 font-bold text-2xl", poppins.className)}>
          FreemanAI
        </span>
      </div>
      <Button variant="ghost" size="icon" onClick={handleOpenOrClose}>
        <Menu />
      </Button>
    </div>
  );
};

export default Topbar;