"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";
import Link from "next/link";

const Topbar = () => {
  const { handleOpenOrClose } = useSidebarStore();

  return (
    <div
      className={cn(
        "group flex w-full items-center p-4 justify-between sticky top-0",
        "lg:hidden"
      )}
    >
      <Link href="/" className="flex items-center">
        <Logo />
      </Link>
      <Button variant="ghost" size="icon" onClick={handleOpenOrClose}>
        <Menu />
      </Button>
    </div>
  );
};

export default Topbar;
