"use server";

import prisma from "@/lib/prismadb";
import { currentUser } from "./auth";

export const getAudios = async () => {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return [];
    }

    const audio = await prisma.audio.findMany({
      where: {
        userId: user.id,
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

    if (!audio) {
      return [];
    }

    return audio;
  } catch (error) {
    return [];
  }
};

export const getAudioById = async (audioId: string) => {
  try {
    const user = await currentUser();
    if (!user?.id) return null;
    const audio = await prisma.audio.findUnique({
      where: {
        id: audioId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!audio) {
      return null;
    }

    return audio;
  } catch (error: any) {
    return null;
  }
};

export const getAudioMessages = async (audioId: string, page: number) => {
  try {
    const MESSAGES_PER_PAGE = 8;
    const skip = page * MESSAGES_PER_PAGE;

    const messages = await prisma.audioMessage.findMany({
      where: { audioId },
      skip: skip,
      take: MESSAGES_PER_PAGE,
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!messages || messages.length === 0) {
      return [];
    }

    return messages.map(({ sender, content }) => ({
      role: sender === "user" ? "user" : "assistant",
      content: JSON.parse(content as string),
    }));
  } catch (error) {
    return [];
  }
};
