import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error("Error: Missing OpenAI API key");
}

const openai = new OpenAI({ apiKey: openaiApiKey });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages) {
      return new NextResponse("Message is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant knowledgeable about programming. Provide clear and accurate explanations or suggestions related to code.",
        },
        ...messages,
      ],
    });

    if (!response.choices || response.choices.length === 0) {
      console.error("Error: No choices returned from OpenAI API");
      return new NextResponse("No response from OpenAI", { status: 500 });
    }

    await increaseApiLimit();

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
