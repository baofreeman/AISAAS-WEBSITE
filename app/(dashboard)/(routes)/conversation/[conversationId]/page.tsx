import {
  getConversationById,
  getConversationMessages,
} from "@/lib/conversations";
import ConversationContent from "./conversation-content";
import ContentPage from "@/components/dashboard/content-page";

const ConversationIdPage = ({
  params,
}: {
  params: { conversationId: string };
}) => {
  return (
    <ContentPage
      getItemById={getConversationById}
      getMessagesById={getConversationMessages}
      params={{ id: params.conversationId }}
      ContentComponent={ConversationContent}
      emptyLabel="No conversation available"
      title="Conversation"
    />
  );
};

export default ConversationIdPage;
