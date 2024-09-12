import prisma from "@/lib/prismadb";
import { DAY_IN_MS, MAX_FREE_COUNTS } from "@/contants";
import { currentUser } from "./auth";

export const increaseApiLimit = async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    return;
  }

  const userId = user.id;

  try {
    await prisma.userApiLimit.upsert({
      where: { userId: userId },
      update: { count: { increment: 1 } },
      create: { userId: userId, count: 1 },
    });
  } catch (error) {
    console.error("Error increasing API limit:", error);
    // Handle the error appropriately
  }
};

export const checkApiLimit = async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    return false;
  }

  try {
    const dbUser = await prisma.userApiLimit.findUnique({
      where: { userId: user.id },
    });

    return !dbUser || (dbUser.count || 0) < MAX_FREE_COUNTS;
  } catch (error) {
    console.error("Error checking API limit:", error);
    return false; // Assume limit reached in case of error
  }
};

export const getApiLimitCount = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    return 0;
  }

  try {
    const dbUser = await prisma.userApiLimit.findUnique({
      where: { userId: user.id },
    });

    return dbUser?.count || 0;
  } catch (error) {
    console.error("Error getting API limit count:", error);
    return 0; // Return 0 in case of error
  }
};

export const checkSubscription = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    return false;
  }

  try {
    const userSubscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    if (!userSubscription) {
      return false;
    }

    const isValid =
      userSubscription.stripePriceId &&
      userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
        Date.now();
    return !!isValid;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false; // Assume no valid subscription in case of error
  }
};
