import { NextResponse } from "next/server";
import Replicate from "replicate";
import {
  checkApiLimit,
  checkSubscription,
  increaseApiLimit,
} from "@/lib/api-limit";
import { currentUser } from "@/lib/auth";
import prisma from "@/lib/prismadb";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { prompt } = body;

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Message is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to continue.",
        { status: 403 }
      );
    }

    const output = await replicate.run(
      "cjwbw/damo-text-to-video:1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755",
      {
        input: {
          fps: 8,
          prompt: prompt,
          num_frames: 50,
          num_inference_steps: 50,
        },
      }
    );

    await increaseApiLimit();

    let video = await prisma.video.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!video) {
      video = await prisma.video.create({
        data: {
          userId: user.id,
        },
      });
    }

    await prisma.videoMessage.createMany({
      data: [
        {
          content: JSON.stringify(prompt),
          sender: "user",
          videoId: video.id,
        },
        {
          content: JSON.stringify(output),
          sender: "assistant",
          videoId: video.id,
        },
      ],
    });

    await prisma.video.update({
      where: { id: video.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(output);
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
