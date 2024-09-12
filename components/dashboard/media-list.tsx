import Link from "next/link";
import React from "react";
import moment from "moment-timezone";

import CreateNewConversation from "@/components/dashboard/create-new-conversation";

interface MediaItem {
  id: string;
}

interface MediaListProps {
  items: MediaItem[];
  itemType: string;
  getItemLink: (id: string) => string;
}

const MediaList: React.FC<MediaListProps> = ({
  items,
  itemType,
  getItemLink,
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p>No {itemType} available.</p>
        <div className="mt-6">
          <CreateNewConversation />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 relative">
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center overflow-y-auto">
        {items.map((item) => (
          <Link
            href={getItemLink(item.id)}
            key={item.id}
            className="border p-4 rounded-lg"
          >
            <h1 className="cursor-pointer">{item.id}</h1>
          </Link>
        ))}
        <div className="mt-6">
          <CreateNewConversation />
        </div>
      </div>
    </div>
  );
};

export default MediaList;
