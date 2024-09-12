import React from "react";
import { getConversations } from "@/lib/conversations";
import MediaList from "@/components/dashboard/media-list";

export const dynamic = "force-dynamic";

const ConversationPage = async () => {
  const conversations = await getConversations();

  return (
    <MediaList
      items={conversations}
      itemType="conversations"
      getItemLink={(id) => `/conversation/${id}`}
    />
  );
};

export default ConversationPage;
