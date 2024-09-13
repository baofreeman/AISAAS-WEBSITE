"use client";

import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "../ui/progress";
import { useEffect, useState } from "react";

interface FreeCounterProps {
  isProPlan: boolean;
  userLimitCount: number;
}

const FreeCounter: React.FC<FreeCounterProps> = ({
  isProPlan,
  userLimitCount,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="border-t border-t-card-foreground pt-2">
      {!isProPlan && (
        <div className="mb-4">
          <div className="text-center mb-2 text-muted-foreground font-semibold">
            {userLimitCount}/{MAX_FREE_COUNTS} Free generations
          </div>
          <Progress
            value={(userLimitCount / MAX_FREE_COUNTS) * 100}
            className="bg-popover h-3"
            indicatorClasName="gradient-btn"
          />
        </div>
      )}
    </div>
  );
};

export default FreeCounter;
