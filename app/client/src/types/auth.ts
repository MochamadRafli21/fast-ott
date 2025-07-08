import { z } from "zod";

export const userRoleEnum = z.enum(["USER", "ADMIN"]);
export type UserRole = z.infer<typeof userRoleEnum>;

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: userRoleEnum,
});
export type User = z.infer<typeof userSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema;
export type RegisterInput = z.infer<typeof registerSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
