import express from "express";
import { upload } from "@/middleware/multer";
import { requireAuth } from "@/middleware/auth";
import {
  uploadThumbnail,
  uploadVideoFile,
} from "@/controllers/upload.controller";

const router = express.Router();

router.post(
  "/thumbnail",
  requireAuth(["ADMIN"]),
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  uploadThumbnail,
);

router.post(
  "/video",
  requireAuth(["ADMIN"]),
  upload.fields([{ name: "video", maxCount: 1 }]),
  uploadVideoFile,
);

export default router;
