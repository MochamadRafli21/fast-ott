import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const comparePassword = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);

export const signToken = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const requireAuth =
  (roles: string[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) res.status(401).json({ error: "Unauthorized" });

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        if (roles.length && !roles.includes(decoded.role)) {
          res.status(403).json({ error: "Forbidden" });
        }
        (req as any).user = decoded;
        next();
      }
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
