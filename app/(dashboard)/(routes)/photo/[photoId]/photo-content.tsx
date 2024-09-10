"use client";

import { CommonInput } from "@/components/common-input";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { photoSchema } from "@/schema/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import usePhoto from "@/hooks/use-photo";
import LoadMore from "./loadmore";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import UserMessage from "@/components/dashboard/user-message";
import MarkdownResponse from "@/components/dashboard/markdown-response";
import AiResponse from "@/components/dashboard/ai-response";

interface Message {
  role: string;
  content: string | string[];
}

const PhotoContent = ({ initialMessages }: { initialMessages: Message[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const { photoId } = usePhoto();

  const form = useForm<z.infer<typeof photoSchema>>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      prompt: "",
      amount: 1,
      resolution: "512x512",
    },
  });

  const onSubmit = async (values: z.infer<typeof photoSchema>) => {
    try {
      setIsLoading(true);
      const newUserMessage: Message = {
        role: "user",
        content: values.prompt,
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      const response = await fetch(`/api/photo/${photoId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: values.prompt,
          amount: values.amount,
          resolution: values.resolution,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const data = await response.json();
      const newAssistantMessage: Message = { role: "assistant", content: data };
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);

      form.reset();
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
          <Empty label="No images generated." />
        )}
        <div className="h-full">
          <div className="w-full h-full overflow-y-auto">
            <LoadMore photoId={photoId} />
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
                                  <Image
                                    alt="Generated photo"
                                    fill
                                    src={imageUrl}
                                  />
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
            <div ref={messagesEndRef} />
            {isLoading && <Loader />}
          </div>
        </div>
      </div>
      <CommonInput
        schema={photoSchema}
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={{
          prompt: "",
          amount: 1,
          resolution: "512x512",
        }}
        showFields={true}
      />
    </div>
  );
};

export default PhotoContent;