import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed":
      if (!session?.metadata?.userId) {
        return new NextResponse("User id is required", { status: 400 });
      }

      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await prisma.userSubscription.create({
          data: {
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      } catch (error) {
        console.error("Error creating user subscription:", error);
        return new NextResponse("Error creating user subscription", {
          status: 400,
        });
      }
      break;

    case "invoice.payment_succeeded":
      if (!session.subscription) {
        return new NextResponse("Subscription ID is missing", { status: 400 });
      }

      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (!subscription) {
          return new NextResponse("Subscription not found", { status: 400 });
        }

        await prisma.userSubscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      } catch (error) {
        console.error("Error updating user subscription:", error);
        return new NextResponse("Error updating user subscription", {
          status: 400,
        });
      }
      break;

    case "customer.subscription.deleted":
      if (!session.subscription) {
        return new NextResponse("Subscription ID is missing", { status: 400 });
      }

      try {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (!subscription) {
          return new NextResponse("Subscription not found", { status: 400 });
        }

        await prisma.userSubscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            isActive: false,
            endedAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Error updating subscription status:", error);
        return new NextResponse("Error updating subscription status", {
          status: 400,
        });
      }
      break;

    case "invoice.payment_failed":
      if (!session.subscription) {
        return new NextResponse("Subscription ID is missing", { status: 400 });
      }

      try {
        await prisma.userSubscription.update({
          where: {
            stripeSubscriptionId: session.subscription as string,
          },
          data: {
            status: "payment_failed",
          },
        });
      } catch (error) {
        console.error("Error updating subscription payment status:", error);
        return new NextResponse("Error updating subscription payment status", {
          status: 400,
        });
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
