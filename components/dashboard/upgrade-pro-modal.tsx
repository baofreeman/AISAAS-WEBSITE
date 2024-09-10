"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import SubScriptionButton from "../subscription-button";
import { useProState } from "@/store/pro-store";

interface UpgradeProModalProps {
  isProPlan?: boolean;
}

const UpgradeProModal: React.FC<UpgradeProModalProps> = ({ isProPlan }) => {
  const { isOpen, handleCloseProModal } = useProState();
  return (
    <Dialog open={isOpen}>
      <DialogContent showOverlay onClick={handleCloseProModal}>
        <SubScriptionButton isPro={isProPlan} />
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeProModal;
