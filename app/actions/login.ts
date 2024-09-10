"use client";

import { signIn } from "next-auth/react";

export const login = async (provider: string) => {
  await signIn(provider);
};
