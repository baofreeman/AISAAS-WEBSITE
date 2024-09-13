"use client";

import { useEffect, useState } from "react";
import UpgradeProModal from "./dashboard/upgrade-pro-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <div className="p-8">
      <UpgradeProModal />
    </div>
  );
};

export default ModalProvider;
