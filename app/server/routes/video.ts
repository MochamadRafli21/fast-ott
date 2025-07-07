import express from "express";
import { requireAuth } from "@/middleware/auth";
import { upload } from "@/middleware/multer"; // config with multer.fields
import {
  uploadVideo,
  listVideos,
  getVideo,
  deleteVideo,
} from "@/controllers/video.controller";

const router = express.Router();

router.post(
  "/",
  requireAuth(["ADMIN"]),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo,
);

router.get("/", listVideos);
router.get("/:id", getVideo);
router.delete("/:id", requireAuth(["ADMIN"]), deleteVideo);

export default router;
