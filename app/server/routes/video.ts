import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import cloudinary from "../lib/cloudinary";
import { getRoles, requireAuth } from "../lib/auth";
import { Readable } from "stream";
import { Role, VIDEO_STATUS } from "../generated/prisma";

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer();

async function uploadToCloudinary(buffer: Buffer, folder = "videos") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video",
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

router.post(
  "/",
  requireAuth(["ADMIN"]),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    const { title, descriptions } = req.body;

    const files = req.files as {
      video?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    };

    const videoFile = files?.["video"]?.[0];
    const thumbFile = files?.["thumbnail"]?.[0];

    if (!videoFile || !thumbFile) {
      res.status(400).json({ error: "Video and thumbnail required" });
      return;
    }

    const videoRes: any = await uploadToCloudinary(videoFile.buffer);
    const thumbRes: any = cloudinary.uploader
      .upload_stream(
        {
          folder: "thumbnails",
          resource_type: "image",
        },
        () => {},
      )
      .end(thumbFile.buffer); // simple wrapper for images

    const video = await prisma.video.create({
      data: {
        title,
        descriptions,
        url: videoRes.secure_url,
        thumbnail: thumbRes.secure_url,
      },
    });

    res.json(video);
  },
);

router.get("/", async (req, res) => {
  const userRole = getRoles(req);

  const videos = await prisma.video.findMany({
    where: {
      ...(userRole === Role.USER ? { status: VIDEO_STATUS.PUBLISH } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(videos);
});

router.get("/:id", async (req, res) => {
  const userRole = getRoles(req);

  const video = await prisma.video.findUnique({
    where: {
      id: req.params.id,
      ...(userRole === Role.USER ? { status: VIDEO_STATUS.PUBLISH } : {}),
    },
  });

  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }

  res.json(video);
});

router.delete("/:id", requireAuth(["ADMIN"]), async (req, res) => {
  const video = await prisma.video.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true, video });
});

export default router;
