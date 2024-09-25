"use client";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import Logo from "../logo";
import Link from "next/link";

const SidebarToggle = dynamic(() => import("./sidebarToggle"), { ssr: false });
const Navbar = dynamic(() => import("./navbar"), { ssr: false });
const ThemeToggle = dynamic(() => import("./themeToggle"), { ssr: false });
const FreeCounter = dynamic(() => import("./free-counter"), { ssr: false });
const SubScriptionButton = dynamic(() => import("../subscription-button"), {
  ssr: false,
});
const Profile = dynamic(() => import("./profile"), { ssr: false });

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

  return (
    <div
      className={cn("relative h-full text-foreground bg-background", className)}
    >
      <div className="h-20 pl-7 pr-6">
        <div className="flex items-center justify-between">
          {!isMinimal && (
            <Link href="/">
              <div className="group flex gap-2">
                <Logo />
                <span className={cn("ml-2 text-2xl", poppins.className)}>
                  FreemanAI
                </span>
              </div>
            </Link>
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
        <div className="mb-4 p-2 rounded-lg bg-card">
          <div className="mb-4 flex items-center">
            <Profile />
          </div>
          {!isMinimal && (
            <FreeCounter
              isProPlan={!!isProPlan}
              userLimitCount={userLimitCount || 0}
            />
          )}
          {!isMinimal && <SubScriptionButton isPro={isProPlan} />}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
