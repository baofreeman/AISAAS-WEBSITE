"use client";

import { CommonInput } from "@/components/common-input";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { MessageDisplay } from "@/components/message-display";
import useConversation from "@/hooks/use-conversation";
import { audioSchema, conversationSchema } from "@/schema/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import LoadMore from "./loadmore";
import useAudio from "@/hooks/use-audio";
import UserMessage from "@/components/dashboard/user-message";
import MarkdownResponse from "@/components/dashboard/markdown-response";
import AiResponse from "@/components/dashboard/ai-response";

type MessageContent = string | { audio: string };

const AudioContent = ({ initialMessages }: { initialMessages: any }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: MessageContent }>
  >(initialMessages || []);

  const { audioId } = useAudio();

  const form = useForm<z.infer<typeof audioSchema>>({
    resolver: zodResolver(audioSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof audioSchema>) => {
    try {
      setIsLoading(true);

      const newUserMessage = { role: "user", content: values.prompt };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      const response = await fetch(`/api/audio/${audioId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      const newAssistantMessage = { role: "assistant", content: data };
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
            <LoadMore audioId={audioId} />
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
                          <source
                            src={(message.content as { audio: string }).audio}
                          />
                        </audio>
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
        placeholder="Start the audio..."
      />
    </div>
  );
};

export default AudioContent;
