"use client";

import { useProState } from "@/store/pro-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useSidebarStore } from "@/store/sidebar-store";
import { useCurrentUser } from "@/hooks/use-current-user";

const Profile = () => {
  const { isMinimal } = useSidebarStore();
  const user = useCurrentUser();
  const { handleOpenOrCloseProModal } = useProState();

  return (
    <Button variant="link" onClick={handleOpenOrCloseProModal}>
      <Avatar className="rounded-full w-8 h-8 flex items-center justify-center">
        <AvatarImage src={user?.image ?? ""} />
        <AvatarFallback>{user?.name}</AvatarFallback>
      </Avatar>
      {!isMinimal && <span className="text-sm ml-4">{user?.email}</span>}
    </Button>
  );
};

export default Profile;
