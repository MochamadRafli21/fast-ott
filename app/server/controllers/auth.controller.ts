import type { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
  type AuthResponse,
} from "@ott/types";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, signToken } from "@/middleware/auth";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response<AuthResponse>) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() } as any);
      return;
    }

    const { email, password, role }: RegisterInput = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: "Email already exists" } as any);
      return;
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: role ?? "USER",
      },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Register failed" } as any);
  }
};

export const login = async (req: Request, res: Response<AuthResponse>) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() } as any);
      return;
    }

    const { email, password }: LoginInput = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" } as any);
      return;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      res.status(400).json({ error: "Invalid credentials" } as any);
      return;
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" } as any);
  }
};

export const getMe = (req: Request, res: Response) => {
  const user = req.user; // assumed to be set by requireAuth middleware
  res.json({ user });
};
