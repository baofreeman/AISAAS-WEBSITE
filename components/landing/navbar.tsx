"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Logo from "../logo";

import { useCurrentUser } from "@/hooks/use-current-user";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const Navbar = () => {
  const user = useCurrentUser();
  console.log(user);
  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Logo />
        <h1 className={cn("text-2xl font-bold text-white", poppins.className)}>
          FreemanAI
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={user ? "/dashboard" : "/login"}>
          <Button variant="outline">Get Started</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
