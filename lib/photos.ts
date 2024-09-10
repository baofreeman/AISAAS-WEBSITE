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
    const limit = 8;
    const skip = page * limit;

    const messageExisting = await prisma.photoMessage.findMany({
      where: { photoId: photoId },
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
