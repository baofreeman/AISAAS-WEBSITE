import { NextResponse } from "next/server";
import Replicate from "replicate";
import {
  checkApiLimit,
  checkSubscription,
  increaseApiLimit,
} from "@/lib/api-limit";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

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
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const output = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          alpha: 0.5,
          prompt_a: prompt,
          prompt_b: prompt,
          denoising: 0.75,
          seed_image_id: "vibes",
          num_inference_steps: 50,
        },
      }
    );
    await increaseApiLimit();

    let audio = await prisma.audio.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!audio) {
      audio = await prisma.audio.create({
        data: {
          userId: user.id,
        },
      });
    }

    await prisma.audioMessage.createMany({
      data: [
        {
          content: JSON.stringify(prompt),
          sender: "user",
          audioId: audio.id,
        },
        {
          content: JSON.stringify(output),
          sender: "assistant",
          audioId: audio.id,
        },
      ],
    });

    await prisma.audio.update({
      where: { id: audio.id },
      data: { updatedAt: new Date() },
    });
    console.log(output);
    return NextResponse.json(output);
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
