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
    const limit = 8;
    const skip = page * limit;

    const messageExisting = await prisma.audioMessage.findMany({
      where: { audioId: audioId },
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!messageExisting || messageExisting.length === 0) {
      return [];
    }

    const messages = messageExisting.reverse().map(({ sender, content }) => {
      const parsedContent = JSON.parse(content as string);
      return {
        role: sender === "user" ? "user" : "assistant",
        content: parsedContent,
      };
    });

    return messages;
  } catch (error) {
    return [];
  }
};
