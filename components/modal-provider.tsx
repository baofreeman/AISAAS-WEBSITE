"use client";

import { useEffect, useState } from "react";
import ProModal from "./pro-modal";
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
    <>
      <UpgradeProModal />
    </>
  );
};

export default ModalProvider;
