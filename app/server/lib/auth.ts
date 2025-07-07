import jwt from "jsonwebtoken";
import type { Request } from "express";
import type { Role } from "@/generated/prisma";

export type TokenPayload = {
  id: string;
  email: string;
  role: Role;
};

export const getRoles = (req: Request): undefined | Role => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded.role;
  } catch {
    return;
  }
};
