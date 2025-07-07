import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  comparePassword,
  signToken,
  requireAuth,
} from "../lib/auth";

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) res.status(400).json({ error: "Email already exists" });

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
    res.status(500).json({ error: "Register failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) res.status(400).json({ error: "Invalid credentials" });

    const valid = await comparePassword(password, user.password);
    if (!valid) res.status(400).json({ error: "Invalid credentials" });

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
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me (Protected)
router.get("/me", requireAuth(), async (req, res) => {
  const user = (req as any).user;
  res.json({ user });
});

export default router;
