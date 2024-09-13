import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prismadb";
import { currentUser } from "@/lib/auth";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    if (!userSubscription || !userSubscription.stripeCustomerId) {
      return new NextResponse("Subscription not found", { status: 404 });
    }
    const dashboardUrl = absoluteUrl("/dashboard");

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: dashboardUrl,
    });

    return new NextResponse(JSON.stringify({ url: portalSession.url }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
