"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";

const Topbar = () => {
  const { handleOpenOrClose } = useSidebarStore();

  return (
    <div
      className={cn(
        "group flex w-full items-center p-4 justify-between sticky top-0",
        "lg:hidden"
      )}
    >
      <div className="flex items-center">
        <Logo />
      </div>
      <Button variant="ghost" size="icon" onClick={handleOpenOrClose}>
        <Menu />
      </Button>
    </div>
  );
};

export default Topbar;
