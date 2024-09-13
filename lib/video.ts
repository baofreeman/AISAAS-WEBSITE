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
    const MESSAGES_PER_PAGE = 8;
    const skip = page * MESSAGES_PER_PAGE;

    const messages = await prisma.videoMessage.findMany({
      where: { videoId },
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
