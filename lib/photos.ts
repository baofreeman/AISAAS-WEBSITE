"use server";

import prisma from "@/lib/prismadb";
import { currentUser } from "./auth";

export const getPhotos = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return [];
    }

    const photos = await prisma.photo.findMany({
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

    if (!photos) {
      return [];
    }

    return photos;
  } catch (error) {
    return [];
  }
};

export const getPhotoById = async (photoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const photo = await prisma.photo.findUnique({
      where: {
        id: photoId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!photo) {
      return null;
    }

    return photo;
  } catch (error: any) {
    return null;
  }
};

export const getPhotoMessages = async (photoId: string, page: number) => {
  try {
    const MESSAGES_PER_PAGE = 8;
    const skip = page * MESSAGES_PER_PAGE;

    const messages = await prisma.photoMessage.findMany({
      where: { photoId },
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
