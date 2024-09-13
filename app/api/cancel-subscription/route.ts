import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    if (!userSubscription || !userSubscription.stripeSubscriptionId) {
      return new NextResponse("Subscription not found", { status: 404 });
    }

    await stripe.subscriptions.cancel(userSubscription.stripeSubscriptionId);

    await prisma.userSubscription.update({
      where: { stripeSubscriptionId: userSubscription.stripeSubscriptionId },
      data: {
        stripeSubscriptionId: null,
        stripeCustomerId: null,
      },
    });

    return new NextResponse("Subscription canceled successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
