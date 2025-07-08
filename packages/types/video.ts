import { z } from "zod";

export const videoStatusEnum = z.enum(["DRAFT", "PUBLISH"]);
export const videoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  descriptions: z.string().min(1),
  status: videoStatusEnum,
  url: z.string().url(),
  thumbnail: z.string().url(),
  createdAt: z.string(),
});

export const createVideoSchema = videoSchema.omit({
  id: true,
  createdAt: true,
});
export const updateVideoSchema = createVideoSchema.partial();

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
