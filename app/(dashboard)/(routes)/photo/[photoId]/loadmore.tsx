"use client";

import AiResponse from "@/components/dashboard/ai-response";
import MarkdownResponse from "@/components/dashboard/markdown-response";
import UserMessage from "@/components/dashboard/user-message";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { getPhotoMessages } from "@/lib/photos";
import { Download } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";

interface LoadMoreProps {
  photoId: string;
}

interface MessageType {
  role: string;
  content: string | string[];
}

const LoadMore: React.FC<LoadMoreProps> = ({ photoId }) => {
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
      const result = await getPhotoMessages(photoId, page);

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
  }, [photoId, page, hasMore, isLoading]);

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
                  <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.isArray(message.content) &&
                      message.content.map((imageUrl, imageIndex) => (
                        <Card
                          key={`${messageIndex}-${imageIndex}`}
                          className="rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image alt="Generated photo" fill src={imageUrl} />
                          </div>
                          <CardFooter className="p-2">
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={() => window.open(imageUrl)}
                            >
                              <Download className="size-4 mr-2" />
                              Download
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
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
