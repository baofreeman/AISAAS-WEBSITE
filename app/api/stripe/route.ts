import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!user.email || !user.id) {
      return new NextResponse("Invalid user data", { status: 400 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    const dashboardUrl = absoluteUrl("/dashboard");

    if (userSubscription?.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: dashboardUrl,
      });
      return NextResponse.json({ url: session.url }, { status: 200 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: dashboardUrl,
      cancel_url: dashboardUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "AI Pro Plan",
              description: "Unlimited AI Generations",
            },
            unit_amount: 10_000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url }, { status: 200 });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
