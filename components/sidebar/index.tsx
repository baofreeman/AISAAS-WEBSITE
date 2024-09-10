"use client";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import Logo from "../logo";
import SidebarToggle from "./sidebarToggle";
import Navbar from "./navbar";
import ThemeToggle from "./themeToggle";
import FreeCounter from "./free-counter";
import { Poppins } from "next/font/google";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import SubScriptionButton from "../subscription-button";

interface SidebarProps {
  className?: string;
  isProPlan?: boolean;
  userLimitCount?: number;
}

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const Sidebar: React.FC<SidebarProps> = ({
  className,
  isProPlan,
  userLimitCount,
}) => {
  const { isMinimal } = useSidebarStore();
  const user = useCurrentUser();
  return (
    <div
      className={cn("relative h-full text-foreground bg-background", className)}
    >
      <div className="h-20 pl-7 pr-6">
        <div className="flex items-center justify-between">
          {!isMinimal && (
            <div className="group flex gap-2">
              <Logo />
              <span
                className={cn("ml-2 font-bold text-2xl", poppins.className)}
              >
                FreemanAI
              </span>
            </div>
          )}
          <SidebarToggle />
        </div>
      </div>
      <div className="grow overflow-y-auto scroll-smooth scrollbar-none">
        <Navbar />
      </div>
      <div
        className={cn(
          "absolute px-4 w-full flex flex-col items-center justify-center bottom-8"
        )}
      >
        <div className="mb-4 p-2 rounded-lg">
          <div className="mb-4 flex items-center">
            {!isMinimal && <span className="text-sm ml-4">{user?.email}</span>}
          </div>
          {!isMinimal && (
            <FreeCounter
              isProPlan={!!isProPlan}
              userLimitCount={userLimitCount || 0}
            />
          )}
          {!isMinimal && <SubScriptionButton isPro={isProPlan} />}
        </div>
        {isMinimal && (
          <Avatar className="rounded-full w-8 h-8 flex items-center justify-center mb-2">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
