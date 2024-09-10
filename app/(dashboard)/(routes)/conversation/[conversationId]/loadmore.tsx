"use client";

import Loader from "@/components/loader";
import { MessageDisplay } from "@/components/message-display";
import { getConversationMessages } from "@/lib/conversations";
import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";

interface LoadMoreProps {
  conversationId: string;
}

interface MessageType {
  role: string;
  content: any;
}

const LoadMore: React.FC<LoadMoreProps> = ({ conversationId }) => {
  const { ref, inView } = useInView({
    trackVisibility: true,
    delay: 500,
    rootMargin: "50px",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const result = await getConversationMessages(conversationId, page);

      if (result && result.length > 0) {
        setMessages((currentMessages) => [...result, ...currentMessages]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, page, hasMore, isLoading]);

  useEffect(() => {
    if (inView && hasMore) {
      fetchData();
    }
  }, [inView, hasMore]);

  return (
    <>
      {hasMore && (
        <div ref={ref} className="m-auto text-center w-full">
          {isLoading && <Loader />}
        </div>
      )}

      {messages.length > 0 && (
        <MessageDisplay messages={messages} isLoading={isLoading} />
      )}
    </>
  );
};

export default LoadMore;
