import express from "express";
import { requireAuth } from "@/middleware/auth";
import {
  createVideo,
  updateVideo,
  listVideos,
  getVideo,
  deleteVideo,
} from "@/controllers/video.controller";

const router = express.Router();

router.post("/", requireAuth(["ADMIN"]), createVideo);
router.put("/:id", requireAuth(["ADMIN"]), updateVideo);
router.get("/", listVideos);
router.get("/:id", getVideo);
router.delete("/:id", requireAuth(["ADMIN"]), deleteVideo);

export default router;
