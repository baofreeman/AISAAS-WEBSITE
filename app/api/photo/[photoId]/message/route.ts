import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  checkApiLimit,
  checkSubscription,
  increaseApiLimit,
} from "@/lib/api-limit";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error("Error: Missing OpenAI API key");
}

const openai = new OpenAI({ apiKey: openaiApiKey });

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Message is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to continue.",
        { status: 403 }
      );
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    if (!response.data || response.data.length === 0) {
      console.error("Error: No images returned from API");
      return new NextResponse("No images returned", { status: 500 });
    }

    await increaseApiLimit();

    let photo = await prisma.photo.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!photo) {
      photo = await prisma.photo.create({
        data: {
          userId: user.id,
        },
      });
    }

    await prisma.photoMessage.createMany({
      data: [
        {
          content: JSON.stringify(prompt),
          sender: "user",
          photoId: photo.id,
        },
        {
          content: JSON.stringify(response.data.map((image) => image.url)),
          sender: "assistant",
          photoId: photo.id,
        },
      ],
    });

    await prisma.photo.update({
      where: { id: photo.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(response.data.map((image) => image.url));
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
