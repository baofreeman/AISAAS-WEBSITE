"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubScriptionButton from "../subscription-button";
import { useProState } from "@/store/pro-store";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface UpgradeProModalProps {
  isProPlan?: boolean;
}

const UpgradeProModal: React.FC<UpgradeProModalProps> = ({ isProPlan }) => {
  const { isOpen, handleCloseProModal } = useProState();
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseProModal}>
      <DialogContent className="p-4 lg:p-8">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            Settings
          </DialogTitle>
        </DialogHeader>
        <SubScriptionButton isPro={isProPlan} />
        <Button
          onClick={() => signOut()}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeProModal;
