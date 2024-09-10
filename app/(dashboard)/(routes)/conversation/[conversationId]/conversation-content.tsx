"use client";

import { CommonInput } from "@/components/common-input";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { MessageDisplay } from "@/components/message-display";
import useConversation from "@/hooks/use-conversation";
import { conversationSchema } from "@/schema/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import LoadMore from "./loadmore";

const ConversationContent = ({ initialMessages }: { initialMessages: any }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >(initialMessages || []);

  const { conversationId } = useConversation();

  const form = useForm<z.infer<typeof conversationSchema>>({
    resolver: zodResolver(conversationSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof conversationSchema>) => {
    try {
      setIsLoading(true);

      const newUserMessage = { role: "user", content: values.prompt };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      const response = await fetch(
        `/api/conversation/${conversationId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [newUserMessage],
            conversationId: conversationId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      const newAssistantMessage = { role: "assistant", content: data.content };
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
      form.reset({ prompt: "" });
    } catch (error: any) {
      console.error("Error fetching AI response:", error);
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
            <LoadMore conversationId={conversationId} />
            {messages.length > 0 && (
              <>
                <MessageDisplay messages={messages} isLoading={isLoading} />
                <div ref={messagesEndRef} />
              </>
            )}
            {isLoading && <Loader />}
          </div>
        </div>
      </div>
      <CommonInput
        schema={conversationSchema}
        defaultValues={{ prompt: "" }}
        onSubmit={onSubmit}
        isLoading={isLoading}
        placeholder="Start the conversation..."
      />
    </div>
  );
};

export default ConversationContent;
