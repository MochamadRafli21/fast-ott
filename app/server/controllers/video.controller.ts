import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getRoles } from "@/lib/auth";
import { Role, VIDEO_STATUS } from "@/generated/prisma";
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/lib/cloudinary";

const prisma = new PrismaClient();

export async function uploadVideo(req: Request, res: Response) {
  const { title } = req.body;
  const videoFile = req.files?.video?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  if (!videoFile || !thumbnailFile) {
    res.status(400).json({ error: "Video and thumbnail required" });
    return;
  }

  const thumbRes = await uploadImageToCloudinary(
    thumbnailFile.buffer,
    "thumbnails",
  );
  const videoRes = await uploadVideoToCloudinary(videoFile.buffer, "videos");

  const video = await prisma.video.create({
    data: {
      title,
      url: videoRes.secure_url,
      thumbnail: thumbRes.secure_url,
    },
  });

  res.json(video);
}

export async function listVideos(req: Request, res: Response) {
  const userRole = getRoles(req);

  const videos = await prisma.video.findMany({
    where: {
      ...(userRole === Role.USER ? { status: VIDEO_STATUS.PUBLISH } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(videos);
}

export async function getVideo(req: Request, res: Response) {
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
}

export async function deleteVideo(req: Request, res: Response) {
  const video = await prisma.video.delete({ where: { id: req.params.id } });
  res.json({ success: true, video });
}
