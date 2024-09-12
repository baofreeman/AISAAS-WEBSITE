import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error("Error: Missing OpenAI API key");
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = user.id;

    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId: userId,
      },
    });

    return NextResponse.json(conversation.id);
  } catch (error: any) {
    console.error("Error creating conversation:", error);
    if (error.code === "P2003") {
      return new NextResponse("User not found", { status: 404 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
