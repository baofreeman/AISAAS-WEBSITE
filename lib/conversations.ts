"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prismadb";

export const getConversations = async () => {
  try {
    const user = await auth();
    if (!user?.user?.id) {
      return [];
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: user.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return conversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const getConversationById = async (conversationId: string) => {
  try {
    const user = await auth();
    if (!user?.user?.id) return null;

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userId: user.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    console.error("Error fetching conversation by ID:", error);
    return null;
  }
};

export const getConversationMessages = async (
  conversationId: string,
  page: number
) => {
  try {
    const MESSAGES_PER_PAGE = 8;
    const skip = page * MESSAGES_PER_PAGE;

    const messages = await prisma.conversationMessage.findMany({
      where: { conversationId },
      skip,
      take: MESSAGES_PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (messages.length === 0) {
      return [];
    }

    const formattedMessages = messages.reverse().map(({ sender, content }) => ({
      role: sender === "user" ? "user" : "assistant",
      content: JSON.parse(content as string),
    }));

    const sortedMessages = formattedMessages.sort((a, b) => {
      if (a.role === "user" && b.role === "assistant") return -1;
      if (a.role === "assistant" && b.role === "user") return 1;
      return 0;
    });

    return sortedMessages;
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return [];
  }
};
