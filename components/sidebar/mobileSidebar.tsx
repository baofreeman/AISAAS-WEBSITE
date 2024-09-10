"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from ".";
import { useSidebarStore } from "@/store/sidebar-store";
import { useEffect, useState } from "react";

interface MobileSidebarProps {
  isProPlan?: boolean;
  userLimitCount?: number;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isProPlan,
  userLimitCount,
}) => {
  const { isOpen } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Sheet open={isOpen}>
      <SheetContent
        side={"left"}
        className="w-screen border-none bg-black p-0 pt-8"
      >
        <Sidebar userLimitCount={userLimitCount} isProPlan={isProPlan} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
