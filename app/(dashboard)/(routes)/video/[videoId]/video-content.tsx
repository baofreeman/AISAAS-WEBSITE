"use client";

import { CommonInput } from "@/components/common-input";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { conversationSchema, videoSchema } from "@/schema/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import UserMessage from "@/components/dashboard/user-message";
import MarkdownResponse from "@/components/dashboard/markdown-response";
import AiResponse from "@/components/dashboard/ai-response";
import useVideo from "@/hooks/use-video";
import LoadMore from "./loadmore";
import { useToast } from "@/components/ui/use-toast";

type MessageContent = string | { video: string };

const VideoContent = ({ initialMessages }: { initialMessages: any }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: MessageContent }>
  >(initialMessages || []);

  const { videoId } = useVideo();

  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof videoSchema>) => {
    try {
      setIsLoading(true);

      const newUserMessage = { role: "user", content: values.prompt };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      const response = await fetch(`/api/video/${videoId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      form.reset({ prompt: "" });

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            variant: "destructive",
            description: "Free trial has expired. Please upgrade to continue",
          });
        } else {
          throw new Error("Failed to fetch AI response");
        }
        return;
      }

      const data = await response.json();
      const newAssistantMessage = { role: "assistant", content: data };
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error: any) {
      console.error("Error fetching AI response:", error);
      toast({
        variant: "destructive",
        description: "An error occurred while fetching the AI response.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex w-full h-full flex-col focus-visible:outline-0">
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 && !isLoading && (
          <Empty label="No conversation started." />
        )}
        <div className="h-full">
          <div className="w-full h-full overflow-y-auto">
            <LoadMore videoId={videoId} />
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
                        {message && (
                          <video
                            controls
                            className="w-full aspect-video mt-8 rounded-lg border bg-black"
                          >
                            <source src={message.content as string} />
                          </video>
                        )}
                      </AiResponse>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
            {isLoading && <Loader />}
          </div>
        </div>
      </div>
      <CommonInput
        schema={conversationSchema}
        defaultValues={{ prompt: "" }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        placeholder="Start the video..."
      />
    </div>
  );
};

export default VideoContent;
