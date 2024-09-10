import { Fragment } from "react";
import AiResponse from "./dashboard/ai-response";
import MarkdownResponse from "./dashboard/markdown-response";
import UserMessage from "./dashboard/user-message";
import Loader from "./loader";

// components/MessageDisplay.tsx
interface MessageDisplayProps {
  messages: any[];
  isLoading: boolean;
}

export const MessageDisplay = ({ messages }: MessageDisplayProps) => {
  return (
    <>
      {messages.map((message, index) => (
        <Fragment key={index}>
          {message.role === "user" ? (
            <UserMessage>
              <MarkdownResponse content={message.content} />
            </UserMessage>
          ) : (
            <AiResponse>
              <MarkdownResponse content={message.content} />
            </AiResponse>
          )}
        </Fragment>
      ))}
    </>
  );
};
