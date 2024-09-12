import dynamic from "next/dynamic";
import Topbar from "@/components/topbar";
import { checkSubscription, getApiLimitCount } from "@/lib/api-limit";
import { cn } from "@/lib/utils";
import React from "react";

const UpgradeProModal = dynamic(
  () => import("@/components/dashboard/upgrade-pro-modal"),
  { ssr: false }
);
const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });
const MobileSidebar = dynamic(
  () => import("@/components/sidebar/mobile-sidebar"),
  { ssr: false }
);

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const isProPlan = await checkSubscription();
  const userLimitCount = await getApiLimitCount();

  return (
    <div
      className={cn(
        "relative flex flex-col w-full h-full overflow-hidden z-0",
        "md:flex-col",
        "lg:flex-row"
      )}
    >
      <header>
        <Topbar />
      </header>
      <main
        className={cn(
          "lg:bg-background w-full h-full lg:overflow-hidden lg:pl-80 [&:has([is-navbar-minimal])]:lg:pl-20"
        )}
      >
        <Sidebar
          userLimitCount={userLimitCount}
          isProPlan={isProPlan}
          className={cn(
            "fixed py-8 left-0 z-20 w-80 hidden [&:has([is-navbar-minimal])]:w-fit",
            "lg:block"
          )}
        />
        <MobileSidebar userLimitCount={userLimitCount} isProPlan={isProPlan} />
        <UpgradeProModal isProPlan={isProPlan} />
        <div
          className={cn(
            "bg-background relative flex w-full h-full max-w-full flex-col overflow-hidden"
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
