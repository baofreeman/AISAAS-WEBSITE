import { z } from "zod";

export const conversationSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
});

export const photoSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

export const audioSchema = z.object({
  prompt: z.string().min(1, {
    message: "Music prompt is required",
  }),
});

export const videoSchema = z.object({
  prompt: z.string().min(1, {
    message: "Video prompt is required",
  }),
});
