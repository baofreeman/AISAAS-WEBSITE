"use client";

import React from "react";
import AiResponse from "@/components/dashboard/ai-response";
import MarkdownResponse from "@/components/dashboard/markdown-response";
import UserMessage from "@/components/dashboard/user-message";
import Loader from "@/components/loader";
import { getAudioMessages } from "@/lib/audio";
import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";

interface LoadMoreProps {
  audioId: string;
}

interface MessageType {
  role: string;
  content: any;
}

const LoadMore: React.FC<LoadMoreProps> = ({ audioId }) => {
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
      const result = await getAudioMessages(audioId, page);

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
  }, [audioId, page, hasMore, isLoading]);

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
        <>
          {messages.map((message, messageIndex) => (
            <React.Fragment key={messageIndex}>
              {message.role === "user" ? (
                <UserMessage>
                  <MarkdownResponse content={message.content as string} />
                </UserMessage>
              ) : (
                <AiResponse>
                  <audio controls className="w-full">
                    <source src={message.content} />
                  </audio>
                </AiResponse>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
};

export default LoadMore;
