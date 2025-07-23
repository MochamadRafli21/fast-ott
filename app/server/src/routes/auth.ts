import express from "express";
import { requireAuth } from "@/middleware/auth";
import { register, login, getMe } from "@/controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth(), getMe);

export default router;
