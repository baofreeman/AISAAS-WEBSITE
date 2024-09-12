"use server";

import prisma from "@/lib/prismadb";
import { currentUser } from "./auth";

export const getVideos = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return [];
    }

    const videos = await prisma.video.findMany({
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

    if (!videos) {
      return [];
    }

    return videos;
  } catch (error) {
    return [];
  }
};

export const getVideoId = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!video) {
      return null;
    }

    return video;
  } catch (error: any) {
    return null;
  }
};

export const getVideoMessage = async (videoId: string, page: number) => {
  try {
    const limit = 8;
    const skip = page * limit;

    const messageExisting = await prisma.videoMessage.findMany({
      where: { videoId: videoId },
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
