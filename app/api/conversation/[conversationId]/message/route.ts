import {
  checkApiLimit,
  checkSubscription,
  increaseApiLimit,
} from "@/lib/api-limit";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Error: Missing OpenAI API key");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { messages, conversationId } = body;

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = user.id;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Invalid or empty messages array", {
        status: 400,
      });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to continue.",
        { status: 403 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
    });

    if (!isPro) {
      await increaseApiLimit();
    }

    if (!response.choices || response.choices.length === 0) {
      console.error("Error: No choices returned from OpenAI API");
      return new NextResponse("No response from OpenAI", { status: 500 });
    }
    const aiResponse = response.choices[0].message;

    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
          userId: userId,
        },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: userId,
        },
      });
    }

    await prisma.$transaction([
      prisma.conversationMessage.createMany({
        data: [
          {
            content: JSON.stringify(messages[messages.length - 1].content),
            sender: "user",
            conversationId: conversation.id,
          },
          {
            content: JSON.stringify(aiResponse.content),
            sender: "assistant",
            conversationId: conversation.id,
          },
        ],
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
