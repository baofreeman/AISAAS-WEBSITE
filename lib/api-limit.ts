import prisma from "@/lib/prismadb";
import { DAY_IN_MS, MAX_FREE_COUNTS } from "@/contants";
import { currentUser } from "./auth";
import { auth } from "@/auth";

export const increaseApiLimit = async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    return;
  }

  const userId = user.id;

  const userExisting = await prisma.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (userExisting) {
    await prisma.userApiLimit.update({
      where: { userId: userId },
      data: { count: (userExisting.count || 0) + 1 },
    });
  } else {
    await prisma.userApiLimit.create({
      data: {
        userId: userId,
        count: 1,
      },
    });
  }
};

export const checkApiLimit = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return false;
  }

  const dbUser = await prisma.userApiLimit.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!dbUser || (dbUser.count || 0) < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) {
    return 0;
  }

  const dbUser = await prisma.userApiLimit.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!dbUser) {
    return 0;
  }

  return dbUser.count || 0;
};

export const checkSubscription = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) {
    return false;
  }

  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();
  return !!isValid;
};
